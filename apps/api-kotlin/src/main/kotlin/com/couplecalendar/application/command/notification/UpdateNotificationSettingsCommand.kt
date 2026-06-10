package com.couplecalendar.application.command.notification

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

data class UpdateNotificationSettingsCommand(
    val userId: UUID,
    val eventEnabled: Boolean? = null,
    val eventReminder: String? = null,
    val anniversaryEnabled: Boolean? = null,
    val anniversaryReminder: String? = null,
    val partnerActivityEnabled: Boolean? = null
) : Command<NotificationSettings>

@Component
class UpdateNotificationSettingsCommandHandler(
    private val repository: NotificationSettingsRepository
) : CommandHandler<UpdateNotificationSettingsCommand, NotificationSettings> {

    @Transactional
    override fun handle(command: UpdateNotificationSettingsCommand): NotificationSettings {
        // 없으면 기본값을 만들어 갱신한다(upsert).
        val existing = repository.findByUserId(command.userId)
        val (settings, isNew) = if (existing != null) {
            existing to false
        } else {
            NotificationSettings.createDefault(command.userId) to true
        }

        try {
            settings.update(
                eventEnabled = command.eventEnabled,
                eventReminder = command.eventReminder,
                anniversaryEnabled = command.anniversaryEnabled,
                anniversaryReminder = command.anniversaryReminder,
                partnerActivityEnabled = command.partnerActivityEnabled
            )
        } catch (e: IllegalArgumentException) {
            throw BadRequestException(e.message ?: "Invalid notification settings update")
        }

        if (isNew) {
            repository.save(settings)
        } else {
            repository.update(settings)
        }
        return settings
    }
}
