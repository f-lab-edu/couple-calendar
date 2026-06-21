package com.couplecalendar.application.command.auth

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.application.dto.response.AuthResponse
import com.couplecalendar.common.exception.UnauthorizedException
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import org.springframework.stereotype.Component

data class EmailAuthCommand(
    val email: String,
    val password: String
) : Command<AuthResponse>

/**
 * 이메일/비밀번호 인증(가입 겸 로그인).
 * 먼저 로그인 시도 → 실패하면 가입 시도. 신규 이메일은 가입+로그인, 기존 이메일은 로그인.
 * (기존 이메일 + 틀린 비번 → 로그인·가입 모두 실패 → 401.)
 */
@Component
class EmailAuthCommandHandler(
    private val userRepository: UserRepository,
    private val supabaseAuthClient: SupabaseAuthClient
) : CommandHandler<EmailAuthCommand, AuthResponse> {

    override fun handle(command: EmailAuthCommand): AuthResponse {
        val authResult = try {
            supabaseAuthClient.signInWithPassword(command.email, command.password)
        } catch (e: UnauthorizedException) {
            supabaseAuthClient.signUpWithEmail(command.email, command.password)
        }

        val email = authResult.email
            ?: throw UnauthorizedException("Email not provided from auth provider")

        var user = userRepository.findByEmail(email)
        if (user == null) {
            user = User.create(
                email = email,
                nickname = email.substringBefore("@")
            )
            userRepository.save(user)
        }

        return AuthResponse(
            accessToken = authResult.accessToken,
            refreshToken = authResult.refreshToken,
            user = AuthResponse.UserInfo(
                id = user.id.toString(),
                email = user.email.value,
                nickname = user.nickname
            )
        )
    }
}
