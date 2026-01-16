package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import com.couplecalendar.infrastructure.persistence.mapper.UserMapper
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
class UserRepositoryAdapter(
    private val jpaRepository: JpaUserRepository,
    private val mapper: UserMapper
) : UserRepository {

    override fun findById(id: UUID): User? =
        jpaRepository.findById(id).orElse(null)?.let { mapper.toDomain(it) }

    override fun findByEmail(email: String): User? =
        jpaRepository.findByEmail(email.lowercase())?.let { mapper.toDomain(it) }

    override fun save(user: User) {
        jpaRepository.save(mapper.toEntity(user))
    }

    override fun update(user: User) {
        val entity = jpaRepository.findById(user.id).orElseThrow {
            IllegalStateException("User not found for update: ${user.id}")
        }
        entity.nickname = user.nickname
        entity.birthday = user.birthday
        entity.coupleId = user.coupleId
        entity.updatedAt = user.updatedAt
        jpaRepository.save(entity)
    }

    override fun delete(id: UUID) {
        jpaRepository.deleteById(id)
    }
}
