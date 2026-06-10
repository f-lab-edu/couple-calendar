package com.couplecalendar.domain.aggregate

import java.time.Instant
import java.util.UUID

/**
 * 사용자별 알림 설정 Aggregate. user 당 1개.
 * reminder 필드는 enum 이 아닌 자유 텍스트("하루 전", "당일" 등).
 */
class NotificationSettings private constructor(
    val userId: UUID,
    private var _eventEnabled: Boolean,
    private var _eventReminder: String,
    private var _anniversaryEnabled: Boolean,
    private var _anniversaryReminder: String,
    private var _partnerActivityEnabled: Boolean,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val eventEnabled: Boolean get() = _eventEnabled
    val eventReminder: String get() = _eventReminder
    val anniversaryEnabled: Boolean get() = _anniversaryEnabled
    val anniversaryReminder: String get() = _anniversaryReminder
    val partnerActivityEnabled: Boolean get() = _partnerActivityEnabled
    val updatedAt: Instant get() = _updatedAt

    /** PATCH 의미론: 전달된 필드만 갱신한다. */
    fun update(
        eventEnabled: Boolean? = null,
        eventReminder: String? = null,
        anniversaryEnabled: Boolean? = null,
        anniversaryReminder: String? = null,
        partnerActivityEnabled: Boolean? = null
    ) {
        eventEnabled?.let { _eventEnabled = it }
        eventReminder?.let {
            require(it.isNotBlank()) { "Event reminder cannot be blank" }
            _eventReminder = it
        }
        anniversaryEnabled?.let { _anniversaryEnabled = it }
        anniversaryReminder?.let {
            require(it.isNotBlank()) { "Anniversary reminder cannot be blank" }
            _anniversaryReminder = it
        }
        partnerActivityEnabled?.let { _partnerActivityEnabled = it }
        _updatedAt = Instant.now()
    }

    companion object {
        const val DEFAULT_EVENT_REMINDER = "하루 전"
        const val DEFAULT_ANNIVERSARY_REMINDER = "당일"

        /** 기본값으로 새 설정을 생성한다. */
        fun createDefault(userId: UUID): NotificationSettings {
            val now = Instant.now()
            return NotificationSettings(
                userId = userId,
                _eventEnabled = true,
                _eventReminder = DEFAULT_EVENT_REMINDER,
                _anniversaryEnabled = true,
                _anniversaryReminder = DEFAULT_ANNIVERSARY_REMINDER,
                _partnerActivityEnabled = true,
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            userId: UUID,
            eventEnabled: Boolean,
            eventReminder: String,
            anniversaryEnabled: Boolean,
            anniversaryReminder: String,
            partnerActivityEnabled: Boolean,
            createdAt: Instant,
            updatedAt: Instant
        ): NotificationSettings = NotificationSettings(
            userId = userId,
            _eventEnabled = eventEnabled,
            _eventReminder = eventReminder,
            _anniversaryEnabled = anniversaryEnabled,
            _anniversaryReminder = anniversaryReminder,
            _partnerActivityEnabled = partnerActivityEnabled,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
