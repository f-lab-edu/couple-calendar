package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.NotificationSettings
import java.util.UUID

interface NotificationSettingsRepository {
    fun findByUserId(userId: UUID): NotificationSettings?
    fun save(settings: NotificationSettings)
    fun update(settings: NotificationSettings)
}
