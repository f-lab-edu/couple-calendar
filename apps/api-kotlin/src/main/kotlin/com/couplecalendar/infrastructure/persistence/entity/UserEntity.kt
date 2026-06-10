package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "users")
class UserEntity(
    @Id
    val id: UUID,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var nickname: String,

    var birthday: LocalDate? = null,

    @Column(columnDefinition = "text")
    var bio: String? = null,

    @Column(name = "partner_nickname")
    var partnerNickname: String? = null,

    @Column(name = "profile_image")
    var profileImage: String? = null,

    @Column(name = "couple_id")
    var coupleId: UUID? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
)
