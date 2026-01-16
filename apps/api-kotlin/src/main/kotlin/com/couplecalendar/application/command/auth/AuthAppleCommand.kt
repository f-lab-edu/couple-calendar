package com.couplecalendar.application.command.auth

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.application.dto.response.AuthResponse
import com.couplecalendar.common.exception.UnauthorizedException
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import org.springframework.stereotype.Component

data class AuthAppleCommand(
    val identityToken: String,
    val authorizationCode: String
) : Command<AuthResponse>

@Component
class AuthAppleCommandHandler(
    private val userRepository: UserRepository,
    private val supabaseAuthClient: SupabaseAuthClient
) : CommandHandler<AuthAppleCommand, AuthResponse> {

    override fun handle(command: AuthAppleCommand): AuthResponse {
        val authResult = supabaseAuthClient.signInWithApple(command.identityToken)

        val email = authResult.email
            ?: throw UnauthorizedException("Email not provided from Apple")

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
            user = AuthResponse.UserInfo(
                id = user.id.toString(),
                email = user.email.value,
                nickname = user.nickname
            )
        )
    }
}
