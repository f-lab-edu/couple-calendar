package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.Event

data class EventResponse(
    val id: String,
    val coupleId: String,
    val title: String,
    val startTime: String,
    val endTime: String,
    val category: String,
    val authorId: String,
    val description: String?,
    val location: String?,
    val createdAt: String,
    val updatedAt: String
) {
    companion object {
        fun fromAggregate(event: Event): EventResponse = EventResponse(
            id = event.id.toString(),
            coupleId = event.coupleId.toString(),
            title = event.title,
            startTime = event.startTime.toString(),
            endTime = event.endTime.toString(),
            category = event.category.name,
            authorId = event.authorId.toString(),
            description = event.description,
            location = event.location,
            createdAt = event.createdAt.toString(),
            updatedAt = event.updatedAt.toString()
        )
    }
}
