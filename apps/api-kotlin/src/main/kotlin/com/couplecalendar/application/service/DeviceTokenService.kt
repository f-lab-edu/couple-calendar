package com.couplecalendar.application.service

import com.couplecalendar.domain.aggregate.DeviceToken
import com.couplecalendar.domain.repository.DeviceTokenRepository
import org.springframework.stereotype.Service
import java.util.UUID

/**
 * 디바이스 푸시 토큰 등록/해제. 토큰 자체가 유일 키라, 같은 토큰이 다시 오면
 * 소유자/플랫폼/last_seen 만 갱신한다(기기 재로그인·소유자 변경 대응).
 */
@Service
class DeviceTokenService(
    private val deviceTokenRepository: DeviceTokenRepository
) {
    fun register(userId: UUID, token: String, platform: String) {
        val deviceToken = deviceTokenRepository.findByToken(token)
            ?.also { it.touch(userId, platform) }
            ?: DeviceToken.create(userId, token, platform)
        deviceTokenRepository.save(deviceToken)
    }

    fun unregister(token: String) {
        deviceTokenRepository.deleteByToken(token)
    }
}
