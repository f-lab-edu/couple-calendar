package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.NotificationSettings

data class NotificationSettingsResponse(
    val eventEnabled: Boolean,
    val eventReminder: String,
    val anniversaryEnabled: Boolean,
    val anniversaryReminder: String,
    val partnerActivityEnabled: Boolean
) {
    companion object {
        fun fromAggregate(settings: NotificationSettings): NotificationSettingsResponse =
            NotificationSettingsResponse(
                eventEnabled = settings.eventEnabled,
                eventReminder = settings.eventReminder,
                anniversaryEnabled = settings.anniversaryEnabled,
                anniversaryReminder = settings.anniversaryReminder,
                partnerActivityEnabled = settings.partnerActivityEnabled
            )
    }
}
