package com.couplecalendar.domain.aggregate

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.util.UUID

class CoupleTest {

    private fun newCouple(startDate: LocalDate = LocalDate.of(2024, 1, 1)): Couple =
        Couple.create(user1Id = UUID.randomUUID(), startDate = startDate)

    @Test
    fun `updateStartDate updates start date for a past date`() {
        val couple = newCouple()
        val newDate = LocalDate.now().minusDays(10)

        couple.updateStartDate(newDate)

        assertEquals(newDate, couple.startDate)
    }

    @Test
    fun `updateStartDate accepts today`() {
        val couple = newCouple()
        val today = LocalDate.now()

        couple.updateStartDate(today)

        assertEquals(today, couple.startDate)
    }

    @Test
    fun `updateStartDate rejects future date`() {
        val couple = newCouple()
        val future = LocalDate.now().plusDays(1)

        val ex = assertThrows(IllegalArgumentException::class.java) {
            couple.updateStartDate(future)
        }
        assertEquals("Start date cannot be in the future", ex.message)
    }

    @Test
    fun `updateStartDate touches updatedAt`() {
        val couple = newCouple()
        val before = couple.updatedAt

        couple.updateStartDate(LocalDate.now().minusDays(1))

        assertTrue(couple.updatedAt >= before)
    }

    @Test
    fun `hasUser is true for user1 and false for unrelated user`() {
        val user1 = UUID.randomUUID()
        val couple = Couple.create(user1Id = user1, startDate = LocalDate.of(2024, 1, 1))

        assertTrue(couple.hasUser(user1))
        assertTrue(!couple.hasUser(UUID.randomUUID()))
    }

    @Test
    fun `getDaysFromStart counts days since start`() {
        val couple = newCouple(LocalDate.now().minusDays(100))

        assertEquals(100L, couple.getDaysFromStart())
    }
}
