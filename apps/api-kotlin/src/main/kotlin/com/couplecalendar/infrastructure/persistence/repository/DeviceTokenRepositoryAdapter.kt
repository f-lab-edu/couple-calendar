package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.DeviceToken
import com.couplecalendar.domain.repository.DeviceTokenRepository
import com.couplecalendar.infrastructure.persistence.mapper.DeviceTokenMapper
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class DeviceTokenRepositoryAdapter(
    private val jpaRepository: JpaDeviceTokenRepository,
    private val mapper: DeviceTokenMapper
) : DeviceTokenRepository {

    override fun findByToken(token: String): DeviceToken? =
        jpaRepository.findByToken(token)?.let { mapper.toDomain(it) }

    override fun findByUserId(userId: UUID): List<DeviceToken> =
        jpaRepository.findByUserId(userId).map { mapper.toDomain(it) }

    override fun findByUserIds(userIds: Collection<UUID>): List<DeviceToken> =
        if (userIds.isEmpty()) emptyList()
        else jpaRepository.findByUserIdIn(userIds).map { mapper.toDomain(it) }

    override fun save(deviceToken: DeviceToken) {
        // 같은 token 행이 있으면 그 행을 갱신(소유자 이동/last_seen 갱신), 없으면 새로 저장.
        val existing = jpaRepository.findByToken(deviceToken.token)
        if (existing != null) {
            existing.userId = deviceToken.userId
            existing.platform = deviceToken.platform
            existing.lastSeenAt = deviceToken.lastSeenAt
            jpaRepository.save(existing)
        } else {
            jpaRepository.save(mapper.toEntity(deviceToken))
        }
    }

    @Transactional
    override fun deleteByToken(token: String) {
        jpaRepository.deleteByToken(token)
    }
}
