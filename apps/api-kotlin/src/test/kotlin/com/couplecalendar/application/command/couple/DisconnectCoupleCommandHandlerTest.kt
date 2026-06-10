package com.couplecalendar.application.command.couple

import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.UserRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.lang.reflect.Field
import java.time.LocalDate
import java.util.UUID

class DisconnectCoupleCommandHandlerTest {

    private val coupleRepository = mockk<CoupleRepository>(relaxed = true)
    private val userRepository = mockk<UserRepository>(relaxed = true)
    private val handler = DisconnectCoupleCommandHandler(coupleRepository, userRepository)

    /** Build a complete couple (both members) via reconstitute. */
    private fun completeCouple(user1: UUID, user2: UUID, coupleId: UUID = UUID.randomUUID()): Couple =
        Couple.reconstitute(
            id = coupleId,
            user1Id = user1,
            user2Id = user2,
            startDate = LocalDate.of(2024, 1, 1),
            inviteCode = null,
            inviteCodeExpiresAt = null,
            createdAt = java.time.Instant.now(),
            updatedAt = java.time.Instant.now()
        )

    private fun userInCouple(id: UUID, coupleId: UUID): User {
        val user = User.create(email = "u-$id@example.com", nickname = "u")
        // reflectively set _coupleId so leaveCouple() is observable
        val field: Field = User::class.java.getDeclaredField("_coupleId")
        field.isAccessible = true
        field.set(user, coupleId)
        return user
    }

    @Test
    fun `clears both members coupleId and deletes the couple`() {
        val user1 = UUID.randomUUID()
        val user2 = UUID.randomUUID()
        val coupleId = UUID.randomUUID()
        val couple = completeCouple(user1, user2, coupleId)

        val member1 = userInCouple(user1, coupleId)
        val member2 = userInCouple(user2, coupleId)

        every { coupleRepository.findByUserId(user1) } returns couple
        every { userRepository.findById(user1) } returns member1
        every { userRepository.findById(user2) } returns member2

        handler.handle(DisconnectCoupleCommand(user1))

        assertNull(member1.coupleId)
        assertNull(member2.coupleId)
        verify { userRepository.update(member1) }
        verify { userRepository.update(member2) }
        verify { coupleRepository.delete(coupleId) }
    }

    @Test
    fun `handles incomplete couple with only user1`() {
        val user1 = UUID.randomUUID()
        val coupleId = UUID.randomUUID()
        val couple = Couple.create(user1Id = user1, startDate = LocalDate.of(2024, 1, 1))
        // create() makes a new random id; capture it
        every { coupleRepository.findByUserId(user1) } returns couple
        val member1 = userInCouple(user1, coupleId)
        every { userRepository.findById(user1) } returns member1

        handler.handle(DisconnectCoupleCommand(user1))

        assertNull(member1.coupleId)
        verify(exactly = 1) { userRepository.update(member1) }
        verify { coupleRepository.delete(couple.id) }
    }

    @Test
    fun `throws NotFound when no couple`() {
        val user1 = UUID.randomUUID()
        every { coupleRepository.findByUserId(user1) } returns null

        assertThrows(NotFoundException::class.java) {
            handler.handle(DisconnectCoupleCommand(user1))
        }
        verify(exactly = 0) { coupleRepository.delete(any()) }
    }

    @Test
    fun `throws Forbidden when user not a member`() {
        val requester = UUID.randomUUID()
        val couple = completeCouple(UUID.randomUUID(), UUID.randomUUID())
        every { coupleRepository.findByUserId(requester) } returns couple

        assertThrows(ForbiddenException::class.java) {
            handler.handle(DisconnectCoupleCommand(requester))
        }
        verify(exactly = 0) { coupleRepository.delete(any()) }
        verify(exactly = 0) { userRepository.update(any()) }
    }
}
