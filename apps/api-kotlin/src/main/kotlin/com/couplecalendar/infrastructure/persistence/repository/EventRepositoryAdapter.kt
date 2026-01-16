package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.Event
import com.couplecalendar.domain.repository.EventRepository
import com.couplecalendar.infrastructure.persistence.mapper.EventMapper
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Repository
class EventRepositoryAdapter(
    private val jpaRepository: JpaEventRepository,
    private val mapper: EventMapper
) : EventRepository {

    override fun findById(id: UUID): Event? =
        jpaRepository.findById(id).orElse(null)?.let { mapper.toDomain(it) }

    override fun findByCoupleId(coupleId: UUID): List<Event> =
        jpaRepository.findByCoupleIdOrderByStartTimeAsc(coupleId).map { mapper.toDomain(it) }

    override fun findByCoupleIdAndDateRange(coupleId: UUID, startDate: Instant, endDate: Instant): List<Event> =
        jpaRepository.findByCoupleIdAndDateRange(coupleId, startDate, endDate).map { mapper.toDomain(it) }

    override fun save(event: Event) {
        jpaRepository.save(mapper.toEntity(event))
    }

    override fun update(event: Event) {
        val entity = jpaRepository.findById(event.id).orElseThrow {
            IllegalStateException("Event not found for update: ${event.id}")
        }
        entity.title = event.title
        entity.startTime = event.startTime
        entity.endTime = event.endTime
        entity.category = event.category.name
        entity.memo = event.description
        entity.location = event.location
        entity.updatedAt = event.updatedAt
        jpaRepository.save(entity)
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }
}
