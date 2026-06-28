package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.DeviceToken
import java.util.UUID

interface DeviceTokenRepository {
    fun findByToken(token: String): DeviceToken?
    fun findByUserId(userId: UUID): List<DeviceToken>
    fun findByUserIds(userIds: Collection<UUID>): List<DeviceToken>
    fun save(deviceToken: DeviceToken)
    /** 호출자 본인 소유의 토큰만 삭제(IDOR 방지). */
    fun deleteByUserIdAndToken(userId: UUID, token: String)
}
