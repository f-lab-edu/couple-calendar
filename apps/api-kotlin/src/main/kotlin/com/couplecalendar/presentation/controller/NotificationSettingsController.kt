package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.UpdateNotificationSettingsRequest
import com.couplecalendar.application.dto.response.NotificationSettingsResponse
import com.couplecalendar.application.service.NotificationSettingsService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users/me/notifications")
class NotificationSettingsController(
    private val notificationSettingsService: NotificationSettingsService
) {

    @GetMapping
    fun getSettings(@CurrentUser user: UserPrincipal): NotificationSettingsResponse =
        notificationSettingsService.getSettings(user.id)

    @PatchMapping
    fun updateSettings(
        @CurrentUser user: UserPrincipal,
        @RequestBody request: UpdateNotificationSettingsRequest
    ): NotificationSettingsResponse =
        notificationSettingsService.updateSettings(user.id, request)
}
