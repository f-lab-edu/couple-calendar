package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.User

data class UserResponse(
    val id: String,
    val email: String,
    val nickname: String,
    val birthday: String?,
    val coupleId: String?,
    val createdAt: String,
    val updatedAt: String
) {
    companion object {
        fun fromAggregate(user: User): UserResponse = UserResponse(
            id = user.id.toString(),
            email = user.email.value,
            nickname = user.nickname,
            birthday = user.birthday?.toString(),
            coupleId = user.coupleId?.toString(),
            createdAt = user.createdAt.toString(),
            updatedAt = user.updatedAt.toString()
        )
    }
}
