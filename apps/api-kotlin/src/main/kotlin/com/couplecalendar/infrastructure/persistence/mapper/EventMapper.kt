package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.Event
import com.couplecalendar.domain.aggregate.EventCategory
import com.couplecalendar.infrastructure.persistence.entity.EventEntity
import org.springframework.stereotype.Component

@Component
class EventMapper {

    fun toDomain(entity: EventEntity): Event = Event.reconstitute(
        id = entity.id,
        coupleId = entity.coupleId,
        title = entity.title,
        startTime = entity.startTime,
        endTime = entity.endTime,
        category = EventCategory.valueOf(entity.category),
        authorId = entity.authorId,
        description = entity.memo,
        location = entity.location,
        createdAt = entity.createdAt,
        updatedAt = entity.updatedAt
    )

    fun toEntity(event: Event): EventEntity = EventEntity(
        id = event.id,
        coupleId = event.coupleId,
        title = event.title,
        startTime = event.startTime,
        endTime = event.endTime,
        category = event.category.name,
        authorId = event.authorId,
        memo = event.description,
        location = event.location,
        createdAt = event.createdAt,
        updatedAt = event.updatedAt
    )
}
