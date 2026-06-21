package com.couplecalendar.infrastructure.config

import com.couplecalendar.application.push.PushSender
import com.couplecalendar.infrastructure.external.FcmPushSender
import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import com.google.firebase.messaging.FirebaseMessaging
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FcmConfig {
    private val log = LoggerFactory.getLogger(javaClass)

    /**
     * 서비스 계정 JSON(env FCM_SERVICE_ACCOUNT_JSON)이 있으면 FCM 발송을 켜고,
     * 없으면 no-op PushSender를 주입한다(자격증명 없이도 앱이 뜨도록).
     */
    @Bean
    fun pushSender(
        @Value("\${fcm.service-account-json:}") serviceAccountJson: String
    ): PushSender {
        if (serviceAccountJson.isBlank()) {
            log.warn("FCM 비활성화 — FCM_SERVICE_ACCOUNT_JSON 미설정. 푸시는 발송되지 않습니다.")
            return FcmPushSender(null)
        }
        return try {
            val credentials = GoogleCredentials.fromStream(serviceAccountJson.byteInputStream())
            val app = if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(
                    FirebaseOptions.builder().setCredentials(credentials).build()
                )
            } else {
                FirebaseApp.getInstance()
            }
            log.info("FCM 활성화 완료")
            FcmPushSender(FirebaseMessaging.getInstance(app))
        } catch (e: Exception) {
            log.error("FCM 초기화 실패 — 푸시 비활성화로 폴백", e)
            FcmPushSender(null)
        }
    }
}
