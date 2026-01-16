package com.couplecalendar.application.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class CreateEventRequest(
    @field:NotBlank(message = "Title is required")
    @field:Size(max = 100, message = "Title must not exceed 100 characters")
    val title: String,

    @field:NotBlank(message = "Start time is required")
    val startTime: String,

    @field:NotBlank(message = "End time is required")
    val endTime: String,

    @field:NotBlank(message = "Category is required")
    val category: String,

    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val description: String? = null,

    val location: String? = null
)

data class UpdateEventRequest(
    @field:Size(max = 100, message = "Title must not exceed 100 characters")
    val title: String? = null,

    val startTime: String? = null,

    val endTime: String? = null,

    val category: String? = null,

    @field:Size(max = 500, message = "Description must not exceed 500 characters")
    val description: String? = null,

    val location: String? = null
)

data class EventQueryRequest(
    val startDate: String? = null,
    val endDate: String? = null
)
