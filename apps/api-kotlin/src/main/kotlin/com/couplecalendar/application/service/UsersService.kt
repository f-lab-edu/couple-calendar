package com.couplecalendar.application.service

import com.couplecalendar.application.command.user.UpdateUserCommand
import com.couplecalendar.application.command.user.UpdateUserCommandHandler
import com.couplecalendar.application.dto.request.UpdateUserRequest
import com.couplecalendar.application.dto.response.UserResponse
import com.couplecalendar.application.query.user.GetUserByIdQuery
import com.couplecalendar.application.query.user.GetUserByIdQueryHandler
import com.couplecalendar.application.query.user.GetUserQuery
import com.couplecalendar.application.query.user.GetUserQueryHandler
import com.couplecalendar.application.query.user.UserQueryResult
import com.couplecalendar.common.exception.ForbiddenException
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class UsersService(
    private val getUserQueryHandler: GetUserQueryHandler,
    private val getUserByIdQueryHandler: GetUserByIdQueryHandler,
    private val updateUserCommandHandler: UpdateUserCommandHandler
) {

    fun getCurrentUser(userId: UUID): UserResponse =
        getUserQueryHandler.handle(GetUserQuery(userId)).toResponse()

    fun getUserById(userId: UUID): UserResponse =
        getUserByIdQueryHandler.handle(GetUserByIdQuery(userId)).toResponse()

    /**
     * Authorized lookup of another user. A requester may only view their own
     * profile or that of their couple partner — otherwise this is an IDOR that
     * leaks PII (email, birthday, …) and enables UUID enumeration.
     */
    fun getUserByIdFor(requesterId: UUID, targetId: UUID): UserResponse {
        if (requesterId != targetId) {
            val myCoupleId = getUserCoupleId(requesterId)
                ?: throw ForbiddenException("다른 사용자를 조회할 권한이 없습니다")
            val targetCoupleId = getUserCoupleId(targetId)
            if (targetCoupleId == null || targetCoupleId != myCoupleId) {
                throw ForbiddenException("다른 사용자를 조회할 권한이 없습니다")
            }
        }
        return getUserById(targetId)
    }

    fun updateCurrentUser(userId: UUID, request: UpdateUserRequest): UserResponse {
        val command = UpdateUserCommand(
            userId = userId,
            name = request.name,
            nickname = request.nickname,
            birthday = request.birthday,
            birthdayPresent = request.birthdayPresent,
            bio = request.bio,
            bioPresent = request.bioPresent,
            partnerNickname = request.partnerNickname,
            partnerNicknamePresent = request.partnerNicknamePresent
        )
        val user = updateUserCommandHandler.handle(command)
        return UserResponse.fromAggregate(user)
    }

    fun getUserCoupleId(userId: UUID): UUID? {
        val result = getUserQueryHandler.handle(GetUserQuery(userId))
        return result.coupleId?.let { UUID.fromString(it) }
    }

    private fun UserQueryResult.toResponse(): UserResponse = UserResponse(
        id = id,
        email = email,
        name = name,
        nickname = nickname,
        birthday = birthday,
        bio = bio,
        partnerNickname = partnerNickname,
        coupleId = coupleId,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
