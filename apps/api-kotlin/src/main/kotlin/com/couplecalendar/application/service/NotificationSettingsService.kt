package com.couplecalendar.application.service

import com.couplecalendar.application.command.notification.UpdateNotificationSettingsCommand
import com.couplecalendar.application.command.notification.UpdateNotificationSettingsCommandHandler
import com.couplecalendar.application.dto.request.UpdateNotificationSettingsRequest
import com.couplecalendar.application.dto.response.NotificationSettingsResponse
import com.couplecalendar.application.query.notification.GetNotificationSettingsQuery
import com.couplecalendar.application.query.notification.GetNotificationSettingsQueryHandler
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NotificationSettingsService(
    private val getNotificationSettingsQueryHandler: GetNotificationSettingsQueryHandler,
    private val updateNotificationSettingsCommandHandler: UpdateNotificationSettingsCommandHandler
) {

    fun getSettings(userId: UUID): NotificationSettingsResponse {
        val settings = getNotificationSettingsQueryHandler.handle(GetNotificationSettingsQuery(userId))
        return NotificationSettingsResponse.fromAggregate(settings)
    }

    fun updateSettings(userId: UUID, request: UpdateNotificationSettingsRequest): NotificationSettingsResponse {
        val command = UpdateNotificationSettingsCommand(
            userId = userId,
            eventEnabled = request.eventEnabled,
            eventReminder = request.eventReminder,
            anniversaryEnabled = request.anniversaryEnabled,
            anniversaryReminder = request.anniversaryReminder,
            partnerActivityEnabled = request.partnerActivityEnabled
        )
        val settings = updateNotificationSettingsCommandHandler.handle(command)
        return NotificationSettingsResponse.fromAggregate(settings)
    }
}
