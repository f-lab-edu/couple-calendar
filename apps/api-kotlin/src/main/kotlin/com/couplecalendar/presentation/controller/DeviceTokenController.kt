package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.RegisterDeviceTokenRequest
import com.couplecalendar.application.dto.request.UnregisterDeviceTokenRequest
import com.couplecalendar.application.service.DeviceTokenService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users/me/device-tokens")
class DeviceTokenController(
    private val deviceTokenService: DeviceTokenService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun register(
        @CurrentUser user: UserPrincipal,
        @Valid @RequestBody request: RegisterDeviceTokenRequest
    ) {
        deviceTokenService.register(user.id, request.token, request.platform)
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unregister(
        @CurrentUser user: UserPrincipal,
        @Valid @RequestBody request: UnregisterDeviceTokenRequest
    ) {
        deviceTokenService.unregister(request.token)
    }
}
