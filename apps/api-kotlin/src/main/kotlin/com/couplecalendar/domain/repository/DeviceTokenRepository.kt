package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.DeviceToken
import java.util.UUID

interface DeviceTokenRepository {
    fun findByToken(token: String): DeviceToken?
    fun findByUserId(userId: UUID): List<DeviceToken>
    fun findByUserIds(userIds: Collection<UUID>): List<DeviceToken>
    fun save(deviceToken: DeviceToken)
    fun deleteByToken(token: String)
}
