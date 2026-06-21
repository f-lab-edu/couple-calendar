package com.couplecalendar.application.dto.response

data class AuthResponse(
    val accessToken: String,
    val refreshToken: String? = null,
    val user: UserInfo
) {
    data class UserInfo(
        val id: String,
        val email: String,
        val nickname: String
    )
}

/**
 * 토큰 갱신 응답. accessToken 만료 시 refresh token으로 발급받은 새 토큰 쌍.
 * (Supabase는 refresh token도 회전시키므로 새 refreshToken을 함께 저장해야 한다.)
 */
data class TokenRefreshResponse(
    val accessToken: String,
    val refreshToken: String? = null
)
