package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.AppleAuthRequest
import com.couplecalendar.application.dto.response.AuthResponse
import com.couplecalendar.application.service.AuthService
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService
) {

    @PostMapping("/apple")
    fun appleAuth(@Valid @RequestBody request: AppleAuthRequest): AuthResponse =
        authService.authenticateWithApple(request.identityToken, request.authorizationCode)
}
