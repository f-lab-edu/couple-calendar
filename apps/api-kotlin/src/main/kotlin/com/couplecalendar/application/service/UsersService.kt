package com.couplecalendar.application.service

import com.couplecalendar.application.dto.response.UserResponse
import com.couplecalendar.application.query.user.GetUserQuery
import com.couplecalendar.application.query.user.GetUserQueryHandler
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UsersService(
    private val getUserQueryHandler: GetUserQueryHandler
) {

    fun getCurrentUser(userId: UUID): UserResponse {
        val result = getUserQueryHandler.handle(GetUserQuery(userId))
        return UserResponse(
            id = result.id,
            email = result.email,
            nickname = result.nickname,
            birthday = result.birthday,
            coupleId = result.coupleId,
            createdAt = result.createdAt,
            updatedAt = result.updatedAt
        )
    }

    fun getUserCoupleId(userId: UUID): UUID? {
        val result = getUserQueryHandler.handle(GetUserQuery(userId))
        return result.coupleId?.let { UUID.fromString(it) }
    }
}
