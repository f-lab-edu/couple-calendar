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
        AND e.startTime <= :endDate
        AND e.endTime >= :startDate
        ORDER BY e.startTime ASC
    """)
    fun findByCoupleIdAndDateRange(
        coupleId: UUID,
        startDate: Instant,
        endDate: Instant
    ): List<EventEntity>

    /** 리마인더 스케줄러용 — 시작 시각이 구간에 드는 모든 커플의 이벤트. */
    fun findByStartTimeBetween(start: Instant, end: Instant): List<EventEntity>
}
