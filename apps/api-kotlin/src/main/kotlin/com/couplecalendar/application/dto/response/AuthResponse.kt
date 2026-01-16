package com.couplecalendar.application.dto.response

data class AuthResponse(
    val accessToken: String,
    val user: UserInfo
) {
    data class UserInfo(
        val id: String,
        val email: String,
        val nickname: String
    )
}
