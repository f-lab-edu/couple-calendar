package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.DeviceTokenEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaDeviceTokenRepository : JpaRepository<DeviceTokenEntity, UUID> {
    fun findByToken(token: String): DeviceTokenEntity?
    fun findByUserId(userId: UUID): List<DeviceTokenEntity>
    fun findByUserIdIn(userIds: Collection<UUID>): List<DeviceTokenEntity>
    fun deleteByToken(token: String)
}
