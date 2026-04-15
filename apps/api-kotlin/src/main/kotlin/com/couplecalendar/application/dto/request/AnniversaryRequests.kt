package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateAnniversaryRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(min = 1, max = 50, message = "Title must be 1 to 50 characters")
    val title: String,

    @field:NotBlank(message = "Date is required")
    val date: String,

    val isRecurring: Boolean = false,

    @field:Size(max = 200, message = "Description must not exceed 200 characters")
    val description: String? = null
)

data class UpdateAnniversaryRequest(
    @field:Size(min = 1, max = 50, message = "Title must be 1 to 50 characters")
    val title: String? = null,

    val date: String? = null,

    val isRecurring: Boolean? = null,

    @field:Size(max = 200, message = "Description must not exceed 200 characters")
    val description: String? = null
)
