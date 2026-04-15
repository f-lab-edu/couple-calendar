package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.Anniversary
import com.couplecalendar.infrastructure.persistence.entity.AnniversaryEntity
import org.springframework.stereotype.Component

@Component
class AnniversaryMapper {

    fun toDomain(entity: AnniversaryEntity): Anniversary = Anniversary.reconstitute(
        id = entity.id,
        coupleId = entity.coupleId,
        title = entity.title,
        date = entity.date,
        isRecurring = entity.isRecurring,
        description = entity.description,
        createdAt = entity.createdAt,
        updatedAt = entity.updatedAt
    )

    fun toEntity(anniversary: Anniversary): AnniversaryEntity = AnniversaryEntity(
        id = anniversary.id,
        coupleId = anniversary.coupleId,
        title = anniversary.title,
        date = anniversary.date,
        isRecurring = anniversary.isRecurring,
        description = anniversary.description,
        createdAt = anniversary.createdAt,
        updatedAt = anniversary.updatedAt
    )
}
