package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.Size

data class UpdateUserRequest(
    @field:Size(min = 1, max = 50, message = "Nickname must be between 1 and 50 characters")
    val nickname: String? = null,

    val birthday: String? = null
)
