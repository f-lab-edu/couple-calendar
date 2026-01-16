package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.EventEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
interface JpaEventRepository : JpaRepository<EventEntity, UUID> {
    fun findByCoupleIdOrderByStartTimeAsc(coupleId: UUID): List<EventEntity>

    @Query("""
        SELECT e FROM EventEntity e
        WHERE e.coupleId = :coupleId
        AND e.startTime >= :startDate
        AND e.endTime <= :endDate
        ORDER BY e.startTime ASC
    """)
    fun findByCoupleIdAndDateRange(
        coupleId: UUID,
        startDate: Instant,
        endDate: Instant
    ): List<EventEntity>
}
