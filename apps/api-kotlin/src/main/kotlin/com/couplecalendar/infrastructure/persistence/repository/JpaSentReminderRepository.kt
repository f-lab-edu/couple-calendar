package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.SentReminderEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
interface JpaSentReminderRepository : JpaRepository<SentReminderEntity, UUID> {
    fun existsByKindAndRefIdAndUserIdAndFireAt(
        kind: String,
        refId: UUID,
        userId: UUID,
        fireAt: Instant
    ): Boolean
}
