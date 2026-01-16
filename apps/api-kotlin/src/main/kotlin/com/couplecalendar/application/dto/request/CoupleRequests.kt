package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateCoupleRequest(
    @field:NotBlank(message = "Start date is required")
    val startDate: String
)

data class ConnectCoupleRequest(
    @field:NotBlank(message = "Invite code is required")
    @field:Size(min = 6, max = 6, message = "Invite code must be 6 characters")
    val inviteCode: String
)
