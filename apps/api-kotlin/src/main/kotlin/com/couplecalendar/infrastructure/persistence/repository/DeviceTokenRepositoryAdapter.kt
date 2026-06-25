package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.domain.aggregate.DeviceToken
import com.couplecalendar.domain.repository.DeviceTokenRepository
import com.couplecalendar.infrastructure.persistence.mapper.DeviceTokenMapper
import org.slf4j.LoggerFactory
import org.springframework.dao.DataIntegrityViolationException
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
        // 같은 token 행이 있으면 그 행을 갱신(소유자 이동/last_seen). FCM 토큰은 기기 설치
        // 단위라, 같은 기기에서 사용자가 바뀌면 소유자도 옮겨 이전 사용자 알림이 새 사용자
        // 기기로 새지 않게 한다. 소유자 변경은 로깅.
        val existing = jpaRepository.findByToken(deviceToken.token)
        if (existing != null) {
            if (existing.userId != deviceToken.userId) {
                log.info("device token ownership transfer: {} -> {}", existing.userId, deviceToken.userId)
            }
            existing.userId = deviceToken.userId
            existing.platform = deviceToken.platform
            existing.lastSeenAt = deviceToken.lastSeenAt
            jpaRepository.save(existing)
            return
        }
        try {
            // flush 로 유니크 위반을 여기서 표면화한다.
            jpaRepository.saveAndFlush(mapper.toEntity(deviceToken))
        } catch (e: DataIntegrityViolationException) {
            // 동시 등록 경쟁(앱이 같은 토큰을 여러 번 등록): 다른 요청이 먼저 넣었으므로
            // 이미 등록된 것으로 보고 성공 처리(멱등). 추가 DB 쓰기는 하지 않는다.
            log.info("device token already registered concurrently (token={}…)", deviceToken.token.take(10))
        }
    }

    @Transactional
    override fun deleteByUserIdAndToken(userId: UUID, token: String) {
        jpaRepository.deleteByUserIdAndToken(userId, token)
    }
}
