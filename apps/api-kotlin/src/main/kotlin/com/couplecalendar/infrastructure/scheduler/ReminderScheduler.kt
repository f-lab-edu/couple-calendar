package com.couplecalendar.infrastructure.scheduler

import com.couplecalendar.application.notification.ReminderOffsets
import com.couplecalendar.application.push.PushSender
import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.DeviceTokenRepository
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import com.couplecalendar.infrastructure.persistence.entity.SentReminderEntity
import com.couplecalendar.infrastructure.persistence.repository.JpaAnniversaryRepository
import com.couplecalendar.infrastructure.persistence.repository.JpaEventRepository
import com.couplecalendar.infrastructure.persistence.repository.JpaSentReminderRepository
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.util.UUID

/**
 * 리마인더 스케줄러. 1분마다 다가오는 일정/기념일을 훑어 각 사용자의 알림 설정
 * (켜짐 여부 + 리마인더 시점)에 맞는 시각이 "방금 도래"하면 그 사용자의 기기들로 FCM 발송.
 *
 * 멱등성: (kind, refId, userId, fireAt) 당 1회만. dedup 행을 먼저 선점(insert)한 뒤
 * 발송하므로 인스턴스가 여러 개여도 중복 발송되지 않는다.
 * GRACE(6h): 다운타임 후 재가동 시 아주 오래된 리마인더까지 소급 발송하진 않는다.
 */
@Component
class ReminderScheduler(
    private val eventRepository: JpaEventRepository,
    private val anniversaryRepository: JpaAnniversaryRepository,
    private val coupleRepository: CoupleRepository,
    private val notificationSettingsRepository: NotificationSettingsRepository,
    private val deviceTokenRepository: DeviceTokenRepository,
    private val sentReminderRepository: JpaSentReminderRepository,
    private val pushSender: PushSender
) {
    private val log = LoggerFactory.getLogger(javaClass)
    private val kst = ZoneId.of("Asia/Seoul")
    private val grace = Duration.ofHours(6)
    private val maxLeadTime = Duration.ofDays(7) // "일주일 전"이 최대 오프셋
    private val anniversaryHour = 9

    @Scheduled(fixedDelay = 60_000, initialDelay = 30_000)
    fun run() {
        if (!pushSender.enabled) return
        val now = Instant.now()
        runCatching { processEvents(now) }.onFailure { log.error("event reminders failed", it) }
        runCatching { processAnniversaries(now) }.onFailure { log.error("anniversary reminders failed", it) }
    }

    private fun processEvents(now: Instant) {
        val events = eventRepository.findByStartTimeBetween(now.minus(grace), now.plus(maxLeadTime))
        for (event in events) {
            val members = membersOf(event.coupleId)
            for (userId in members) {
                val settings = settingsOf(userId)
                if (!settings.eventEnabled) continue
                val offset = ReminderOffsets.parse(settings.eventReminder) ?: continue
                val fireAt = event.startTime.minus(offset)
                maybeSend(
                    kind = "event", refId = event.id, userId = userId, fireAt = fireAt, now = now,
                    title = "📅 ${event.title}", body = leadLabel(offset) + " 일정이 있어요"
                )
            }
        }
    }

    private fun processAnniversaries(now: Instant) {
        val today = LocalDate.now(kst)
        for (anniversary in anniversaryRepository.findAll()) {
            val occurrence = nextOccurrence(anniversary.date, anniversary.isRecurring, today)
            val baseInstant = occurrence.atTime(anniversaryHour, 0).atZone(kst).toInstant()
            val members = membersOf(anniversary.coupleId)
            for (userId in members) {
                val settings = settingsOf(userId)
                if (!settings.anniversaryEnabled) continue
                val offset = ReminderOffsets.parse(settings.anniversaryReminder) ?: continue
                val fireAt = baseInstant.minus(offset)
                maybeSend(
                    kind = "anniversary", refId = anniversary.id, userId = userId, fireAt = fireAt, now = now,
                    title = "💝 ${anniversary.title}", body = leadLabel(offset) + " 기념일이에요"
                )
            }
        }
    }

    private fun maybeSend(
        kind: String, refId: UUID, userId: UUID, fireAt: Instant, now: Instant,
        title: String, body: String
    ) {
        // 도래 판정: fireAt 이 지났고(<= now) 너무 오래되지 않음(> now - grace).
        if (fireAt.isAfter(now) || fireAt.isBefore(now.minus(grace))) return

        // 선점: dedup 행을 먼저 insert. 이미 있으면(다른 인스턴스/이전 tick) 유니크 위반 → 스킵.
        try {
            sentReminderRepository.saveAndFlush(
                SentReminderEntity(UUID.randomUUID(), kind, refId, userId, fireAt, Instant.now())
            )
        } catch (e: DataIntegrityViolationException) {
            return
        }

        val tokens = deviceTokenRepository.findByUserId(userId).map { it.token }
        if (tokens.isEmpty()) return

        val invalid = pushSender.send(
            tokens, title, body,
            mapOf("kind" to kind, "refId" to refId.toString())
        )
        invalid.forEach { deviceTokenRepository.deleteByUserIdAndToken(userId, it) }
    }

    private fun membersOf(coupleId: UUID): List<UUID> {
        val couple = coupleRepository.findById(coupleId) ?: return emptyList()
        return listOfNotNull(couple.user1Id, couple.user2Id)
    }

    private fun settingsOf(userId: UUID): NotificationSettings =
        notificationSettingsRepository.findByUserId(userId) ?: NotificationSettings.createDefault(userId)

    private fun nextOccurrence(date: LocalDate, recurring: Boolean, today: LocalDate): LocalDate {
        if (!recurring) return date
        var occ = try { date.withYear(today.year) } catch (e: Exception) { date } // 2/29 등 방어
        if (occ.isBefore(today)) occ = occ.plusYears(1)
        return occ
    }

    private fun leadLabel(offset: Duration): String = when {
        offset.isZero -> "오늘"
        offset.toDays() >= 7 -> "일주일 뒤"
        offset.toDays() >= 1 -> "${offset.toDays()}일 뒤"
        offset.toHours() >= 1 -> "${offset.toHours()}시간 뒤"
        else -> "${offset.toMinutes()}분 뒤"
    }
}
