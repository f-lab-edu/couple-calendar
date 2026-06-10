package com.couplecalendar.application.command.auth

import com.couplecalendar.common.exception.UnauthorizedException
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test

class AuthAppleCommandHandlerTest {

    private val userRepository = mockk<UserRepository>(relaxed = true)
    private val supabaseAuthClient = mockk<SupabaseAuthClient>()
    private val handler = AuthAppleCommandHandler(userRepository, supabaseAuthClient)

    private fun authResult(email: String?) =
        SupabaseAuthClient.AuthResult(accessToken = "token-123", email = email)

    @Test
    fun `authenticates existing user without authorizationCode`() {
        val existing = User.create(email = "alice@example.com", nickname = "alice")
        every { supabaseAuthClient.signInWithApple("id-token") } returns authResult("alice@example.com")
        every { userRepository.findByEmail("alice@example.com") } returns existing

        val response = handler.handle(AuthAppleCommand(identityToken = "id-token", authorizationCode = null))

        assertEquals("token-123", response.accessToken)
        assertEquals("alice@example.com", response.user.email)
        verify(exactly = 0) { userRepository.save(any()) }
    }

    @Test
    fun `authenticates existing user even when authorizationCode is provided`() {
        val existing = User.create(email = "alice@example.com", nickname = "alice")
        every { supabaseAuthClient.signInWithApple("id-token") } returns authResult("alice@example.com")
        every { userRepository.findByEmail("alice@example.com") } returns existing

        val response = handler.handle(
            AuthAppleCommand(identityToken = "id-token", authorizationCode = "auth-code-xyz")
        )

        assertEquals("token-123", response.accessToken)
        verify(exactly = 0) { userRepository.save(any()) }
    }

    @Test
    fun `creates new user when none exists, with nickname from email local part`() {
        every { supabaseAuthClient.signInWithApple("id-token") } returns authResult("newbie@example.com")
        every { userRepository.findByEmail("newbie@example.com") } returns null

        val response = handler.handle(AuthAppleCommand(identityToken = "id-token"))

        val saved = slot<User>()
        verify(exactly = 1) { userRepository.save(capture(saved)) }
        assertEquals("newbie", saved.captured.nickname)
        assertEquals("newbie@example.com", response.user.email)
    }

    @Test
    fun `throws Unauthorized when Apple does not return an email`() {
        every { supabaseAuthClient.signInWithApple("id-token") } returns authResult(null)

        assertThrows(UnauthorizedException::class.java) {
            handler.handle(AuthAppleCommand(identityToken = "id-token"))
        }
    }
}
