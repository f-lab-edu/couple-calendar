package com.couplecalendar.application.command.user

import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.UUID

class UpdateUserCommandHandlerTest {

    private val userRepository = mockk<UserRepository>(relaxed = true)
    private val handler = UpdateUserCommandHandler(userRepository)

    private fun existingUser(birthday: LocalDate? = null): User =
        User.create(email = "alice@example.com", nickname = "alice", birthday = birthday)

    @Test
    fun `throws NotFound when user does not exist`() {
        val userId = UUID.randomUUID()
        every { userRepository.findById(userId) } returns null

        assertThrows(NotFoundException::class.java) {
            handler.handle(UpdateUserCommand(userId, name = "X"))
        }
    }

    @Test
    fun `updates name and persists`() {
        val userId = UUID.randomUUID()
        val user = existingUser()
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(UpdateUserCommand(userId, name = "New Name"))

        assertEquals("New Name", result.name)
        verify { userRepository.update(user) }
    }

    @Test
    fun `rejects blank name as BadRequest`() {
        val userId = UUID.randomUUID()
        every { userRepository.findById(userId) } returns existingUser()

        val ex = assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateUserCommand(userId, name = "  "))
        }
        assertEquals("Name cannot be blank", ex.message)
    }

    @Test
    fun `rejects blank nickname as BadRequest`() {
        val userId = UUID.randomUUID()
        every { userRepository.findById(userId) } returns existingUser()

        assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateUserCommand(userId, nickname = ""))
        }
    }

    @Test
    fun `parses and sets birthday when present`() {
        val userId = UUID.randomUUID()
        val user = existingUser()
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(
            UpdateUserCommand(userId, birthday = "1990-05-20", birthdayPresent = true)
        )

        assertEquals(LocalDate.of(1990, 5, 20), result.birthday)
    }

    @Test
    fun `rejects malformed birthday as BadRequest`() {
        val userId = UUID.randomUUID()
        every { userRepository.findById(userId) } returns existingUser()

        val ex = assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateUserCommand(userId, birthday = "20-13-99", birthdayPresent = true))
        }
        assertEquals("Invalid birthday format. Expected YYYY-MM-DD", ex.message)
    }

    @Test
    fun `rejects future birthday as BadRequest`() {
        val userId = UUID.randomUUID()
        every { userRepository.findById(userId) } returns existingUser()
        val future = LocalDate.now().plusDays(1).toString()

        val ex = assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateUserCommand(userId, birthday = future, birthdayPresent = true))
        }
        assertEquals("Birthday cannot be in the future", ex.message)
    }

    @Test
    fun `clears birthday when present with null value`() {
        val userId = UUID.randomUUID()
        val user = existingUser(birthday = LocalDate.of(1990, 1, 1))
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(
            UpdateUserCommand(userId, birthday = null, birthdayPresent = true)
        )

        assertNull(result.birthday)
    }

    @Test
    fun `does not change birthday when not present`() {
        val userId = UUID.randomUUID()
        val existing = LocalDate.of(1990, 1, 1)
        val user = existingUser(birthday = existing)
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(
            UpdateUserCommand(userId, name = "X", birthday = null, birthdayPresent = false)
        )

        assertEquals(existing, result.birthday)
    }

    @Test
    fun `partial update only touches provided fields`() {
        val userId = UUID.randomUUID()
        val user = existingUser()
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(
            UpdateUserCommand(userId, bio = "my bio", bioPresent = true)
        )

        assertEquals("my bio", result.bio)
        assertEquals("alice", result.nickname) // untouched
        assertEquals("alice", result.name) // untouched
    }

    @Test
    fun `clears partnerNickname when present with null`() {
        val userId = UUID.randomUUID()
        val user = existingUser()
        user.updateProfile(partnerNickname = "honey", partnerNicknamePresent = true)
        every { userRepository.findById(userId) } returns user

        val result = handler.handle(
            UpdateUserCommand(userId, partnerNickname = null, partnerNicknamePresent = true)
        )

        assertNull(result.partnerNickname)
    }
}
