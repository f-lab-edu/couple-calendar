package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.DeviceToken
import com.couplecalendar.domain.repository.DeviceTokenRepository
import com.couplecalendar.infrastructure.persistence.mapper.DeviceTokenMapper
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Repository
class DeviceTokenRepositoryAdapter(
    private val jpaRepository: JpaDeviceTokenRepository,
    private val mapper: DeviceTokenMapper
) : DeviceTokenRepository {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun findByToken(token: String): DeviceToken? =
        jpaRepository.findByToken(token)?.let { mapper.toDomain(it) }

    override fun findByUserId(userId: UUID): List<DeviceToken> =
        jpaRepository.findByUserId(userId).map { mapper.toDomain(it) }

    override fun findByUserIds(userIds: Collection<UUID>): List<DeviceToken> =
        if (userIds.isEmpty()) emptyList()
        else jpaRepository.findByUserIdIn(userIds).map { mapper.toDomain(it) }

    override fun save(deviceToken: DeviceToken) {
        // 같은 token 행이 있으면 그 행을 갱신(소유자 이동/last_seen 갱신), 없으면 새로 저장.
        // FCM 토큰은 기기 설치 단위라, 같은 기기에서 사용자가 바뀌면 소유자도 옮겨야
        // 이전 사용자 알림이 새 사용자 기기로 새지 않는다(프라이버시). 소유자 변경은 로깅한다.
        val existing = jpaRepository.findByToken(deviceToken.token)
        if (existing != null) {
            if (existing.userId != deviceToken.userId) {
                log.info("device token ownership transfer: {} -> {}", existing.userId, deviceToken.userId)
            }
            existing.userId = deviceToken.userId
            existing.platform = deviceToken.platform
            existing.lastSeenAt = deviceToken.lastSeenAt
            jpaRepository.save(existing)
        } else {
            jpaRepository.save(mapper.toEntity(deviceToken))
        }
    }

    @Transactional
    override fun deleteByUserIdAndToken(userId: UUID, token: String) {
        // 본인 소유 토큰만 삭제(IDOR 방지). 남의 토큰을 넘겨도 매칭되지 않아 no-op.
        jpaRepository.deleteByUserIdAndToken(userId, token)
    }
}
