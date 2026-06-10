package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank

data class AppleAuthRequest(
    @field:NotBlank(message = "Identity token is required")
    val identityToken: String,

    val authorizationCode: String? = null
)
