package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "couples")
class CoupleEntity(
    @Id
    val id: UUID,

    @Column(name = "user1_id", nullable = false)
    val user1Id: UUID,

    @Column(name = "user2_id")
    var user2Id: UUID? = null,

    @Column(name = "start_date", nullable = false)
    val startDate: LocalDate,

    @Column(name = "invite_code")
    var inviteCode: String? = null,

    @Column(name = "invite_code_expires_at")
    var inviteCodeExpiresAt: Instant? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
)
