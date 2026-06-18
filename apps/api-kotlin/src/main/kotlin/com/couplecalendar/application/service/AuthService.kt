package com.couplecalendar.application.service

import com.couplecalendar.application.command.auth.AuthAppleCommand
import com.couplecalendar.application.command.auth.AuthAppleCommandHandler
import com.couplecalendar.application.command.auth.EmailAuthCommand
import com.couplecalendar.application.command.auth.EmailAuthCommandHandler
import com.couplecalendar.application.dto.response.AuthResponse
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authAppleCommandHandler: AuthAppleCommandHandler,
    private val emailAuthCommandHandler: EmailAuthCommandHandler
) {

    fun authenticateWithApple(identityToken: String, authorizationCode: String? = null): AuthResponse {
        val command = AuthAppleCommand(identityToken, authorizationCode)
        return authAppleCommandHandler.handle(command)
    }

    fun authenticateWithEmail(email: String, password: String): AuthResponse {
        val command = EmailAuthCommand(email, password)
        return emailAuthCommandHandler.handle(command)
    }
}
