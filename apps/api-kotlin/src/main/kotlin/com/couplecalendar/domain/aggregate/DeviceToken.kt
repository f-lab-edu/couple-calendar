package com.couplecalendar.domain.aggregate

import java.time.Instant
import java.util.UUID

/**
 * 사용자 기기의 푸시 토큰(FCM registration token). user 당 여러 개(기기별) 가능.
 * 같은 token 은 유일하며, 다른 사용자에게 재등록되면 소유자를 옮긴다(기기 재사용).
 */
class DeviceToken private constructor(
    val id: UUID,
    private var _userId: UUID,
    val token: String,
    private var _platform: String,
    val createdAt: Instant,
    private var _lastSeenAt: Instant
) {
    val userId: UUID get() = _userId
    val platform: String get() = _platform
    val lastSeenAt: Instant get() = _lastSeenAt

    /** 같은 토큰이 다시 등록될 때 소유자/플랫폼/최근접속 갱신. */
    fun touch(userId: UUID, platform: String) {
        _userId = userId
        _platform = platform
        _lastSeenAt = Instant.now()
    }

    companion object {
        fun create(userId: UUID, token: String, platform: String): DeviceToken {
            val now = Instant.now()
            return DeviceToken(UUID.randomUUID(), userId, token, platform, now, now)
        }

        fun reconstitute(
            id: UUID,
            userId: UUID,
            token: String,
            platform: String,
            createdAt: Instant,
            lastSeenAt: Instant
        ): DeviceToken = DeviceToken(id, userId, token, platform, createdAt, lastSeenAt)
    }
}
