package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.NotificationSettingsEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaNotificationSettingsRepository : JpaRepository<NotificationSettingsEntity, UUID>
