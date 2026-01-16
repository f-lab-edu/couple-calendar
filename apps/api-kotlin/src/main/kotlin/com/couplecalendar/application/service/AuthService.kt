package com.couplecalendar.application.service

import com.couplecalendar.application.command.auth.AuthAppleCommand
import com.couplecalendar.application.command.auth.AuthAppleCommandHandler
import com.couplecalendar.application.dto.response.AuthResponse
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authAppleCommandHandler: AuthAppleCommandHandler
) {

    fun authenticateWithApple(identityToken: String, authorizationCode: String): AuthResponse {
        val command = AuthAppleCommand(identityToken, authorizationCode)
        return authAppleCommandHandler.handle(command)
    }
}
