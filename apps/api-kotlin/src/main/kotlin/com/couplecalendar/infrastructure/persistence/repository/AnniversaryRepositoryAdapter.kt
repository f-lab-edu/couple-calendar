package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.Anniversary
import com.couplecalendar.domain.repository.AnniversaryRepository
import com.couplecalendar.infrastructure.persistence.mapper.AnniversaryMapper
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class AnniversaryRepositoryAdapter(
    private val jpaRepository: JpaAnniversaryRepository,
    private val mapper: AnniversaryMapper
) : AnniversaryRepository {

    override fun findById(id: UUID): Anniversary? =
        jpaRepository.findById(id).orElse(null)?.let { mapper.toDomain(it) }

    override fun findByCoupleId(coupleId: UUID): List<Anniversary> =
        jpaRepository.findByCoupleIdOrderByDateAsc(coupleId).map { mapper.toDomain(it) }

    override fun save(anniversary: Anniversary) {
        jpaRepository.save(mapper.toEntity(anniversary))
    }

    override fun update(anniversary: Anniversary) {
        val entity = jpaRepository.findById(anniversary.id).orElseThrow {
            IllegalStateException("Anniversary not found for update: ${anniversary.id}")
        }
        entity.title = anniversary.title
        entity.date = anniversary.date
        entity.isRecurring = anniversary.isRecurring
        entity.description = anniversary.description
        entity.updatedAt = anniversary.updatedAt
        jpaRepository.save(entity)
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }
}
