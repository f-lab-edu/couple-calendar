package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "events")
class EventEntity(
    @Id
    val id: UUID,

    @Column(name = "couple_id", nullable = false)
    val coupleId: UUID,

    @Column(nullable = false)
    var title: String,

    @Column(name = "start_time", nullable = false)
    var startTime: Instant,

    @Column(name = "end_time", nullable = false)
    var endTime: Instant,

    @Column(name = "is_all_day")
    var isAllDay: Boolean = false,

    @Column(nullable = false)
    var category: String,

    @Column(name = "author_id", nullable = false)
    val authorId: UUID,

    @Column(columnDefinition = "TEXT")
    var memo: String? = null,

    var location: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
)
