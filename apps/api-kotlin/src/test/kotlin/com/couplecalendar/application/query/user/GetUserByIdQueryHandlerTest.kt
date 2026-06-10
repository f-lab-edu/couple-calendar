package com.couplecalendar.application.query.user

import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.infrastructure.persistence.entity.UserEntity
import com.couplecalendar.infrastructure.persistence.repository.JpaUserRepository
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDate
import java.util.Optional
import java.util.UUID

class GetUserByIdQueryHandlerTest {

    private val jpaUserRepository = mockk<JpaUserRepository>()
    private val getUserQueryHandler = GetUserQueryHandler(jpaUserRepository)
    private val handler = GetUserByIdQueryHandler(getUserQueryHandler)

    private fun userEntity(id: UUID, coupleId: UUID? = null) = UserEntity(
        id = id,
        email = "alice@example.com",
        name = "Alice",
        nickname = "alice",
        birthday = LocalDate.of(1990, 1, 1),
        bio = "hi",
        partnerNickname = "honey",
        coupleId = coupleId,
        createdAt = Instant.parse("2024-01-01T00:00:00Z"),
        updatedAt = Instant.parse("2024-01-02T00:00:00Z")
    )

    @Test
    fun `throws NotFound when user missing`() {
        val id = UUID.randomUUID()
        every { jpaUserRepository.findById(id) } returns Optional.empty()

        assertThrows(NotFoundException::class.java) {
            handler.handle(GetUserByIdQuery(id))
        }
    }

    @Test
    fun `maps entity to result with all fields`() {
        val id = UUID.randomUUID()
        val coupleId = UUID.randomUUID()
        every { jpaUserRepository.findById(id) } returns Optional.of(userEntity(id, coupleId))

        val result = handler.handle(GetUserByIdQuery(id))

        assertEquals(id.toString(), result.id)
        assertEquals("alice@example.com", result.email)
        assertEquals("Alice", result.name)
        assertEquals("alice", result.nickname)
        assertEquals("1990-01-01", result.birthday)
        assertEquals("hi", result.bio)
        assertEquals("honey", result.partnerNickname)
        assertEquals(coupleId.toString(), result.coupleId)
    }
}
