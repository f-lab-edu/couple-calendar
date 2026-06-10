package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.infrastructure.persistence.entity.NotificationSettingsEntity
import org.springframework.stereotype.Component

@Component
class NotificationSettingsMapper {

    fun toDomain(entity: NotificationSettingsEntity): NotificationSettings =
        NotificationSettings.reconstitute(
            userId = entity.userId,
            eventEnabled = entity.eventEnabled,
            eventReminder = entity.eventReminder,
            anniversaryEnabled = entity.anniversaryEnabled,
            anniversaryReminder = entity.anniversaryReminder,
            partnerActivityEnabled = entity.partnerActivityEnabled,
            createdAt = entity.createdAt,
            updatedAt = entity.updatedAt
        )

    fun toEntity(settings: NotificationSettings): NotificationSettingsEntity =
        NotificationSettingsEntity(
            userId = settings.userId,
            eventEnabled = settings.eventEnabled,
            eventReminder = settings.eventReminder,
            anniversaryEnabled = settings.anniversaryEnabled,
            anniversaryReminder = settings.anniversaryReminder,
            partnerActivityEnabled = settings.partnerActivityEnabled,
            createdAt = settings.createdAt,
            updatedAt = settings.updatedAt
        )
}
