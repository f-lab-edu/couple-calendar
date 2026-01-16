package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.infrastructure.persistence.mapper.CoupleMapper
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class CoupleRepositoryAdapter(
    private val jpaRepository: JpaCoupleRepository,
    private val mapper: CoupleMapper
) : CoupleRepository {

    override fun findById(id: UUID): Couple? =
        jpaRepository.findById(id).orElse(null)?.let { mapper.toDomain(it) }

    override fun findByUserId(userId: UUID): Couple? =
        jpaRepository.findByUserId(userId)?.let { mapper.toDomain(it) }

    override fun findByInviteCode(code: String): Couple? =
        jpaRepository.findByInviteCode(code)?.let { mapper.toDomain(it) }

    override fun save(couple: Couple) {
        jpaRepository.save(mapper.toEntity(couple))
    }

    override fun update(couple: Couple) {
        val entity = jpaRepository.findById(couple.id).orElseThrow {
            IllegalStateException("Couple not found for update: ${couple.id}")
        }
        entity.user2Id = couple.user2Id
        entity.inviteCode = couple.inviteCode
        entity.inviteCodeExpiresAt = couple.inviteCodeExpiresAt
        entity.updatedAt = couple.updatedAt
        jpaRepository.save(entity)
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }
}
