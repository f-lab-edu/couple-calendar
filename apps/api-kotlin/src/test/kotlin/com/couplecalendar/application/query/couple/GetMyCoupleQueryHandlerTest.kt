package com.couplecalendar.application.query.couple

import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.infrastructure.persistence.entity.CoupleEntity
import com.couplecalendar.infrastructure.persistence.repository.JpaCoupleRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

class GetMyCoupleQueryHandlerTest {

    private val jpaCoupleRepository = mockk<JpaCoupleRepository>()
    private val handler = GetMyCoupleQueryHandler(jpaCoupleRepository)

    @Test
    fun `throws NotFound when user has no couple`() {
        val userId = UUID.randomUUID()
        every { jpaCoupleRepository.findByUserId(userId) } returns null

        assertThrows(NotFoundException::class.java) {
            handler.handle(GetMyCoupleQuery(userId))
        }
    }

    @Test
    fun `maps complete couple entity to result with daysFromStart`() {
        val userId = UUID.randomUUID()
        val coupleId = UUID.randomUUID()
        val user2 = UUID.randomUUID()
        val startDate = LocalDate.now().minusDays(30)
        val entity = CoupleEntity(
            id = coupleId,
            user1Id = userId,
            user2Id = user2,
            startDate = startDate,
            inviteCode = null,
            inviteCodeExpiresAt = null,
            createdAt = Instant.parse("2024-01-01T00:00:00Z"),
            updatedAt = Instant.parse("2024-01-02T00:00:00Z")
        )
        every { jpaCoupleRepository.findByUserId(userId) } returns entity

        val result = handler.handle(GetMyCoupleQuery(userId))

        assertEquals(coupleId.toString(), result.id)
        assertEquals(userId.toString(), result.user1Id)
        assertEquals(user2.toString(), result.user2Id)
        assertEquals(startDate.toString(), result.startDate)
        assertEquals(30L, result.daysFromStart)
        assertTrue(result.isComplete)
    }

    @Test
    fun `incomplete couple reports null user2 and isComplete false`() {
        val userId = UUID.randomUUID()
        val entity = CoupleEntity(
            id = UUID.randomUUID(),
            user1Id = userId,
            user2Id = null,
            startDate = LocalDate.now().minusDays(1),
            inviteCode = "ABC123",
            inviteCodeExpiresAt = Instant.parse("2024-12-31T00:00:00Z"),
            createdAt = Instant.now(),
            updatedAt = Instant.now()
        )
        every { jpaCoupleRepository.findByUserId(userId) } returns entity

        val result = handler.handle(GetMyCoupleQuery(userId))

        assertNull(result.user2Id)
        assertTrue(!result.isComplete)
        assertEquals("ABC123", result.inviteCode)
    }
}
