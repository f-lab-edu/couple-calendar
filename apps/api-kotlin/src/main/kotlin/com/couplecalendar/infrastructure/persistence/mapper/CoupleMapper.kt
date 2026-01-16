package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.infrastructure.persistence.entity.CoupleEntity
import org.springframework.stereotype.Component

@Component
class CoupleMapper {

    fun toDomain(entity: CoupleEntity): Couple = Couple.reconstitute(
        id = entity.id,
        user1Id = entity.user1Id,
        user2Id = entity.user2Id,
        startDate = entity.startDate,
        inviteCode = entity.inviteCode,
        inviteCodeExpiresAt = entity.inviteCodeExpiresAt,
        createdAt = entity.createdAt,
        updatedAt = entity.updatedAt
    )

    fun toEntity(couple: Couple): CoupleEntity = CoupleEntity(
        id = couple.id,
        user1Id = couple.user1Id,
        user2Id = couple.user2Id,
        startDate = couple.startDate,
        inviteCode = couple.inviteCode,
        inviteCodeExpiresAt = couple.inviteCodeExpiresAt,
        createdAt = couple.createdAt,
        updatedAt = couple.updatedAt
    )
}
