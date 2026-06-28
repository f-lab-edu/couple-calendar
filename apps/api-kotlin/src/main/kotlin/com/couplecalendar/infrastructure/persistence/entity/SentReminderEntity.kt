package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "sent_reminders")
class SentReminderEntity(
    @Id
    @Column(name = "id")
    val id: UUID,

    @Column(name = "kind", nullable = false)
    val kind: String,

    @Column(name = "ref_id", nullable = false)
    val refId: UUID,

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "fire_at", nullable = false)
    val fireAt: Instant,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant
)
