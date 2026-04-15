package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "anniversaries")
class AnniversaryEntity(
    @Id
    val id: UUID,

    @Column(name = "couple_id", nullable = false)
    val coupleId: UUID,

    @Column(nullable = false)
    var title: String,

    @Column(nullable = false)
    var date: LocalDate,

    @Column(name = "is_recurring", nullable = false)
    var isRecurring: Boolean,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
)
