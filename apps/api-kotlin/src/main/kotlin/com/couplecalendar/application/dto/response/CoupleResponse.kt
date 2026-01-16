package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.Couple

data class CoupleResponse(
    val id: String,
    val user1Id: String,
    val user2Id: String?,
    val startDate: String,
    val inviteCode: String?,
    val inviteCodeExpiresAt: String?,
    val daysFromStart: Long,
    val isComplete: Boolean,
    val createdAt: String,
    val updatedAt: String
) {
    companion object {
        fun fromAggregate(couple: Couple): CoupleResponse = CoupleResponse(
            id = couple.id.toString(),
            user1Id = couple.user1Id.toString(),
            user2Id = couple.user2Id?.toString(),
            startDate = couple.startDate.toString(),
            inviteCode = couple.inviteCode,
            inviteCodeExpiresAt = couple.inviteCodeExpiresAt?.toString(),
            daysFromStart = couple.getDaysFromStart(),
            isComplete = couple.isComplete(),
            createdAt = couple.createdAt.toString(),
            updatedAt = couple.updatedAt.toString()
        )
    }
}

data class InviteCodeResponse(
    val inviteCode: String,
    val expiresAt: String
)
