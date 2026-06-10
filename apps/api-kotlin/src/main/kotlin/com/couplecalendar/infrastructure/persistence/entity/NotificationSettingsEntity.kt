package com.couplecalendar.infrastructure.persistence.entity

import jakarta.persistence.*
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "notification_settings")
class NotificationSettingsEntity(
    @Id
    @Column(name = "user_id")
    val userId: UUID,

    @Column(name = "event_enabled", nullable = false)
    var eventEnabled: Boolean,

    @Column(name = "event_reminder", nullable = false)
    var eventReminder: String,

    @Column(name = "anniversary_enabled", nullable = false)
    var anniversaryEnabled: Boolean,

    @Column(name = "anniversary_reminder", nullable = false)
    var anniversaryReminder: String,

    @Column(name = "partner_activity_enabled", nullable = false)
    var partnerActivityEnabled: Boolean,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: Instant,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant
)
