package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import com.couplecalendar.infrastructure.persistence.mapper.NotificationSettingsMapper
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class NotificationSettingsRepositoryAdapter(
    private val jpaRepository: JpaNotificationSettingsRepository,
    private val mapper: NotificationSettingsMapper
) : NotificationSettingsRepository {

    override fun findByUserId(userId: UUID): NotificationSettings? =
        jpaRepository.findById(userId).orElse(null)?.let { mapper.toDomain(it) }

    override fun save(settings: NotificationSettings) {
        jpaRepository.save(mapper.toEntity(settings))
    }

    override fun update(settings: NotificationSettings) {
        val entity = jpaRepository.findById(settings.userId).orElseThrow {
            IllegalStateException("NotificationSettings not found for update: ${settings.userId}")
        }
        entity.eventEnabled = settings.eventEnabled
        entity.eventReminder = settings.eventReminder
        entity.anniversaryEnabled = settings.anniversaryEnabled
        entity.anniversaryReminder = settings.anniversaryReminder
        entity.partnerActivityEnabled = settings.partnerActivityEnabled
        entity.updatedAt = settings.updatedAt
        jpaRepository.save(entity)
    }
}
