package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "device_tokens")
class DeviceTokenEntity(
    @Id
    @Column(name = "id")
    val id: UUID,

    @Column(name = "user_id", nullable = false)
    var userId: UUID,

    @Column(name = "token", nullable = false, unique = true)
    val token: String,

    @Column(name = "platform", nullable = false)
    var platform: String,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "last_seen_at", nullable = false)
    var lastSeenAt: Instant
)
