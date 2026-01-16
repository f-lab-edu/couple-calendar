package com.couplecalendar.domain.aggregate

import com.couplecalendar.domain.valueobject.InviteCode
import java.time.Instant
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.UUID

class Couple private constructor(
    val id: UUID,
    val user1Id: UUID,
    private var _user2Id: UUID?,
    val startDate: LocalDate,
    private var _inviteCode: InviteCode?,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val user2Id: UUID? get() = _user2Id
    val inviteCode: String? get() = _inviteCode?.value
    val inviteCodeExpiresAt: Instant? get() = _inviteCode?.expiresAt
    val updatedAt: Instant get() = _updatedAt

    fun isComplete(): Boolean = _user2Id != null

    fun hasUser(userId: UUID): Boolean =
        user1Id == userId || _user2Id == userId

    fun connectPartner(user2Id: UUID) {
        require(!isComplete()) { "Couple is already complete" }
        require(user1Id != user2Id) { "Cannot connect with yourself" }
        _user2Id = user2Id
        _inviteCode = null
        _updatedAt = Instant.now()
    }

    fun regenerateInviteCode() {
        require(!isComplete()) { "Cannot regenerate invite code for complete couple" }
        _inviteCode = InviteCode.generate()
        _updatedAt = Instant.now()
    }

    fun isInviteCodeValid(): Boolean = _inviteCode?.isValid() ?: false

    fun getDaysFromStart(): Long =
        ChronoUnit.DAYS.between(startDate, LocalDate.now())

    companion object {
        fun create(user1Id: UUID, startDate: LocalDate): Couple {
            val now = Instant.now()
            return Couple(
                id = UUID.randomUUID(),
                user1Id = user1Id,
                _user2Id = null,
                startDate = startDate,
                _inviteCode = InviteCode.generate(),
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            id: UUID,
            user1Id: UUID,
            user2Id: UUID?,
            startDate: LocalDate,
            inviteCode: String?,
            inviteCodeExpiresAt: Instant?,
            createdAt: Instant,
            updatedAt: Instant
        ): Couple = Couple(
            id = id,
            user1Id = user1Id,
            _user2Id = user2Id,
            startDate = startDate,
            _inviteCode = if (inviteCode != null && inviteCodeExpiresAt != null) {
                InviteCode.fromExisting(inviteCode, inviteCodeExpiresAt)
            } else null,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
