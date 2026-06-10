package com.couplecalendar.application.service

import com.couplecalendar.application.command.user.UpdateUserCommandHandler
import com.couplecalendar.application.query.user.GetUserByIdQuery
import com.couplecalendar.application.query.user.GetUserByIdQueryHandler
import com.couplecalendar.application.query.user.GetUserQuery
import com.couplecalendar.application.query.user.GetUserQueryHandler
import com.couplecalendar.application.query.user.UserQueryResult
import com.couplecalendar.common.exception.ForbiddenException
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import java.util.UUID

class UsersServiceTest {

    private val getUserQueryHandler = mockk<GetUserQueryHandler>()
    private val getUserByIdQueryHandler = mockk<GetUserByIdQueryHandler>()
    private val updateUserCommandHandler = mockk<UpdateUserCommandHandler>(relaxed = true)

    private val service = UsersService(
        getUserQueryHandler,
        getUserByIdQueryHandler,
        updateUserCommandHandler
    )

    private fun result(id: UUID, coupleId: UUID?) = UserQueryResult(
        id = id.toString(),
        email = "u-$id@example.com",
        name = "name",
        nickname = "nick",
        birthday = null,
        bio = null,
        partnerNickname = null,
        coupleId = coupleId?.toString(),
        createdAt = "2024-01-01T00:00:00Z",
        updatedAt = "2024-01-01T00:00:00Z"
    )

    @Test
    fun `getUserByIdFor allows viewing own profile`() {
        val me = UUID.randomUUID()
        every { getUserByIdQueryHandler.handle(GetUserByIdQuery(me)) } returns result(me, null)

        val response = service.getUserByIdFor(requesterId = me, targetId = me)

        assertEquals(me.toString(), response.id)
    }

    @Test
    fun `getUserByIdFor allows viewing partner in same couple`() {
        val me = UUID.randomUUID()
        val partner = UUID.randomUUID()
        val coupleId = UUID.randomUUID()
        every { getUserQueryHandler.handle(GetUserQuery(me)) } returns result(me, coupleId)
        every { getUserQueryHandler.handle(GetUserQuery(partner)) } returns result(partner, coupleId)
        every { getUserByIdQueryHandler.handle(GetUserByIdQuery(partner)) } returns result(partner, coupleId)

        val response = service.getUserByIdFor(requesterId = me, targetId = partner)

        assertEquals(partner.toString(), response.id)
    }

    @Test
    fun `getUserByIdFor forbids viewing stranger when requester has no couple`() {
        val me = UUID.randomUUID()
        val target = UUID.randomUUID()
        every { getUserQueryHandler.handle(GetUserQuery(me)) } returns result(me, null)

        assertThrows(ForbiddenException::class.java) {
            service.getUserByIdFor(requesterId = me, targetId = target)
        }
        verify(exactly = 0) { getUserByIdQueryHandler.handle(any()) }
    }

    @Test
    fun `getUserByIdFor forbids viewing user in a different couple`() {
        val me = UUID.randomUUID()
        val target = UUID.randomUUID()
        every { getUserQueryHandler.handle(GetUserQuery(me)) } returns result(me, UUID.randomUUID())
        every { getUserQueryHandler.handle(GetUserQuery(target)) } returns result(target, UUID.randomUUID())

        assertThrows(ForbiddenException::class.java) {
            service.getUserByIdFor(requesterId = me, targetId = target)
        }
    }

    @Test
    fun `getUserByIdFor forbids viewing target with no couple`() {
        val me = UUID.randomUUID()
        val target = UUID.randomUUID()
        every { getUserQueryHandler.handle(GetUserQuery(me)) } returns result(me, UUID.randomUUID())
        every { getUserQueryHandler.handle(GetUserQuery(target)) } returns result(target, null)

        assertThrows(ForbiddenException::class.java) {
            service.getUserByIdFor(requesterId = me, targetId = target)
        }
    }
}
