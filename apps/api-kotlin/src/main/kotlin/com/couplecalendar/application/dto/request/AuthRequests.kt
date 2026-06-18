package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class AppleAuthRequest(
    @field:NotBlank(message = "Identity token is required")
    val identityToken: String,

    val authorizationCode: String? = null
)

/**
 * 이메일/비밀번호 인증 요청(테스트·일반 로그인용).
 * 단일 엔드포인트가 가입/로그인을 모두 처리한다(이메일 미존재 시 가입, 존재 시 로그인).
 */
data class EmailAuthRequest(
    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Invalid email format")
    val email: String,

    @field:NotBlank(message = "Password is required")
    @field:Size(min = 6, message = "Password must be at least 6 characters")
    val password: String
)
