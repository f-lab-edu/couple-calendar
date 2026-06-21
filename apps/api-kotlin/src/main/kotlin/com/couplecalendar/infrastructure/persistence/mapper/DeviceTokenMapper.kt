package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.DeviceToken
import com.couplecalendar.infrastructure.persistence.entity.DeviceTokenEntity
import org.springframework.stereotype.Component

@Component
class DeviceTokenMapper {
    fun toDomain(entity: DeviceTokenEntity): DeviceToken = DeviceToken.reconstitute(
        id = entity.id,
        userId = entity.userId,
        token = entity.token,
        platform = entity.platform,
        createdAt = entity.createdAt,
        lastSeenAt = entity.lastSeenAt
    )

    fun toEntity(domain: DeviceToken): DeviceTokenEntity = DeviceTokenEntity(
        id = domain.id,
        userId = domain.userId,
        token = domain.token,
        platform = domain.platform,
        createdAt = domain.createdAt,
        lastSeenAt = domain.lastSeenAt
    )
}
