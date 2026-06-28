package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank

/**
 * 푸시 토큰 등록 요청. 앱(네이티브)에서 받은 FCM registration token 을 올린다.
 */
data class RegisterDeviceTokenRequest(
    @field:NotBlank(message = "Token is required")
    val token: String,

    /** "ios" | "android" | "web". 미지정 시 "ios". */
    val platform: String = "ios"
)

/** 로그아웃/토큰 폐기 시 등록 해제. */
data class UnregisterDeviceTokenRequest(
    @field:NotBlank(message = "Token is required")
    val token: String
)
