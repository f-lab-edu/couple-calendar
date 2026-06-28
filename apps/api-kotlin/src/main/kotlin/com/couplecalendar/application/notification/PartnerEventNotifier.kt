package com.couplecalendar.application.notification

import com.couplecalendar.application.push.PushSender
import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.DeviceTokenRepository
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import com.couplecalendar.domain.repository.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import java.util.UUID

/**
 * 일정 생성 시 상대방(파트너)에게 "상대가 일정을 추가했어요" 즉시 푸시.
 * 파트너의 '상대방 활동 알림'(partnerActivityEnabled)이 켜져 있고 기기 토큰이 있을 때만.
 * 트랜잭션 커밋 이후(서비스 계층)에서 호출되며, 어떤 실패도 일정 생성에 영향 주지 않는다.
 */
@Service
class PartnerEventNotifier(
    private val coupleRepository: CoupleRepository,
    private val notificationSettingsRepository: NotificationSettingsRepository,
    private val deviceTokenRepository: DeviceTokenRepository,
    private val userRepository: UserRepository,
    private val pushSender: PushSender
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun notifyEventCreated(authorId: UUID, coupleId: UUID, eventTitle: String) {
        try {
            if (!pushSender.enabled) return
            val couple = coupleRepository.findById(coupleId) ?: return
            val partnerId = listOfNotNull(couple.user1Id, couple.user2Id).firstOrNull { it != authorId } ?: return
            val settings = notificationSettingsRepository.findByUserId(partnerId)
                ?: NotificationSettings.createDefault(partnerId)
            if (!settings.partnerActivityEnabled) return
            val tokens = deviceTokenRepository.findByUserId(partnerId).map { it.token }
            if (tokens.isEmpty()) return
            val authorName = userRepository.findById(authorId)?.nickname ?: "상대방"
            val invalid = pushSender.send(
                tokens,
                "💑 새 일정",
                "${authorName}님이 '${eventTitle}' 일정을 추가했어요",
                mapOf("kind" to "partner_event")
            )
            invalid.forEach { deviceTokenRepository.deleteByUserIdAndToken(partnerId, it) }
        } catch (e: Exception) {
            log.warn("partner event notify failed", e)
        }
    }
}
