package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.User

data class UserResponse(
    val id: String,
    val email: String,
    val name: String,
    val nickname: String,
    val birthday: String?,
    val bio: String?,
    val partnerNickname: String?,
    val coupleId: String?,
    val createdAt: String,
    val updatedAt: String
) {
    companion object {
        fun fromAggregate(user: User): UserResponse = UserResponse(
            id = user.id.toString(),
            email = user.email.value,
            name = user.name,
            nickname = user.nickname,
            birthday = user.birthday?.toString(),
            bio = user.bio,
            partnerNickname = user.partnerNickname,
            coupleId = user.coupleId?.toString(),
            createdAt = user.createdAt.toString(),
            updatedAt = user.updatedAt.toString()
        )
    }
}
