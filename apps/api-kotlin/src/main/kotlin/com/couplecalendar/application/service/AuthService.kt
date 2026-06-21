package com.couplecalendar.application.service

import com.couplecalendar.application.command.auth.AuthAppleCommand
import com.couplecalendar.application.command.auth.AuthAppleCommandHandler
import com.couplecalendar.application.command.auth.EmailAuthCommand
import com.couplecalendar.application.command.auth.EmailAuthCommandHandler
import com.couplecalendar.application.dto.response.AuthResponse
import com.couplecalendar.application.dto.response.TokenRefreshResponse
import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authAppleCommandHandler: AuthAppleCommandHandler,
    private val emailAuthCommandHandler: EmailAuthCommandHandler,
    private val supabaseAuthClient: SupabaseAuthClient
) {

    fun authenticateWithApple(identityToken: String, authorizationCode: String? = null): AuthResponse {
        val command = AuthAppleCommand(identityToken, authorizationCode)
        return authAppleCommandHandler.handle(command)
    }

    fun authenticateWithEmail(email: String, password: String): AuthResponse {
        val command = EmailAuthCommand(email, password)
        return emailAuthCommandHandler.handle(command)
    }

    /**
     * refresh token으로 새 토큰 쌍을 발급한다(accessToken 만료 시). 도메인/DB 변경이 없는
     * 순수 토큰 교환이라 command handler 없이 Supabase 클라이언트를 직접 호출한다.
     */
    fun refresh(refreshToken: String): TokenRefreshResponse {
        val result = supabaseAuthClient.refreshSession(refreshToken)
        return TokenRefreshResponse(
            accessToken = result.accessToken,
            refreshToken = result.refreshToken
        )
    }
}
