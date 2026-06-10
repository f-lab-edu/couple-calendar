package com.couplecalendar.application.command.couple

import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.repository.CoupleRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.UUID

class UpdateCoupleStartDateCommandHandlerTest {

    private val coupleRepository = mockk<CoupleRepository>(relaxed = true)
    private val handler = UpdateCoupleStartDateCommandHandler(coupleRepository)

    @Test
    fun `updates start date for a member with a past date`() {
        val userId = UUID.randomUUID()
        val couple = Couple.create(user1Id = userId, startDate = LocalDate.of(2024, 1, 1))
        every { coupleRepository.findByUserId(userId) } returns couple

        val newDate = LocalDate.now().minusDays(5)
        val result = handler.handle(UpdateCoupleStartDateCommand(userId, newDate))

        assertEquals(newDate, result.startDate)
        val saved = slot<Couple>()
        verify { coupleRepository.update(capture(saved)) }
        assertEquals(newDate, saved.captured.startDate)
    }

    @Test
    fun `rejects future start date with BadRequest before touching repository`() {
        val userId = UUID.randomUUID()
        val future = LocalDate.now().plusDays(1)

        assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateCoupleStartDateCommand(userId, future))
        }
        verify(exactly = 0) { coupleRepository.update(any()) }
    }

    @Test
    fun `throws NotFound when user has no couple`() {
        val userId = UUID.randomUUID()
        every { coupleRepository.findByUserId(userId) } returns null

        assertThrows(NotFoundException::class.java) {
            handler.handle(UpdateCoupleStartDateCommand(userId, LocalDate.now().minusDays(1)))
        }
    }

    @Test
    fun `throws Forbidden when found couple does not contain the user`() {
        val userId = UUID.randomUUID()
        val otherUser = UUID.randomUUID()
        // couple belongs to someone else (defensive check)
        val couple = Couple.create(user1Id = otherUser, startDate = LocalDate.of(2024, 1, 1))
        every { coupleRepository.findByUserId(userId) } returns couple

        assertThrows(ForbiddenException::class.java) {
            handler.handle(UpdateCoupleStartDateCommand(userId, LocalDate.now().minusDays(1)))
        }
        verify(exactly = 0) { coupleRepository.update(any()) }
    }
}
