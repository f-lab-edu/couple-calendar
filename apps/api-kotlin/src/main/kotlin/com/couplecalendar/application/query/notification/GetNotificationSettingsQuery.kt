package com.couplecalendar.application.query.notification

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

/**
 * 사용자의 알림 설정을 조회한다. 없으면 기본값으로 생성(upsert)하여 반환한다.
 */
data class GetNotificationSettingsQuery(val userId: UUID) : Query<NotificationSettings>

@Component
class GetNotificationSettingsQueryHandler(
    private val repository: NotificationSettingsRepository
) : QueryHandler<GetNotificationSettingsQuery, NotificationSettings> {

    @Transactional
    override fun handle(query: GetNotificationSettingsQuery): NotificationSettings {
        repository.findByUserId(query.userId)?.let { return it }

        val created = NotificationSettings.createDefault(query.userId)
        repository.save(created)
        return created
    }
}
