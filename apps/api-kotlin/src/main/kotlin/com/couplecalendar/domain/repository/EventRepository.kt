package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.Event
import java.time.Instant
import java.util.UUID

interface EventRepository {
    fun findById(id: UUID): Event?
    fun findByCoupleId(coupleId: UUID): List<Event>
    fun findByCoupleIdAndDateRange(coupleId: UUID, startDate: Instant, endDate: Instant): List<Event>
    fun save(event: Event)
    fun update(event: Event)
    fun delete(id: UUID)
}
