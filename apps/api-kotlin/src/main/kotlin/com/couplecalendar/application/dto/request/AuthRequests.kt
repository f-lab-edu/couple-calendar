package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank

data class AppleAuthRequest(
    @field:NotBlank(message = "Identity token is required")
    val identityToken: String,

    @field:NotBlank(message = "Authorization code is required")
    val authorizationCode: String
)
