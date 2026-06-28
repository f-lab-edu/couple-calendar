package com.couplecalendar.infrastructure.external

import com.couplecalendar.application.push.PushSender
import com.google.firebase.messaging.FirebaseMessaging
import com.google.firebase.messaging.MessagingErrorCode
import com.google.firebase.messaging.MulticastMessage
import com.google.firebase.messaging.Notification
import org.slf4j.LoggerFactory

/**
 * FCM 발송 구현. messaging 이 null 이면(자격증명 없음) 아무것도 보내지 않는 no-op.
 */
class FcmPushSender(
    private val messaging: FirebaseMessaging?
) : PushSender {

    private val log = LoggerFactory.getLogger(javaClass)

    override val enabled: Boolean get() = messaging != null

    override fun send(
        tokens: List<String>,
        title: String,
        body: String,
        data: Map<String, String>
    ): List<String> {
        val fcm = messaging
        if (fcm == null || tokens.isEmpty()) return emptyList()

        val message = MulticastMessage.builder()
            .setNotification(Notification.builder().setTitle(title).setBody(body).build())
            .putAllData(data)
            .addAllTokens(tokens)
            .build()

        return try {
            val response = fcm.sendEachForMulticast(message)
            val invalid = mutableListOf<String>()
            response.responses.forEachIndexed { i, r ->
                if (!r.isSuccessful) {
                    val code = r.exception?.messagingErrorCode
                    // 미등록/잘못된 토큰은 정리 대상으로 반환.
                    if (code == MessagingErrorCode.UNREGISTERED || code == MessagingErrorCode.INVALID_ARGUMENT) {
                        invalid += tokens[i]
                    } else {
                        log.warn("FCM send failed (kept): code={} msg={}", code, r.exception?.message)
                    }
                }
            }
            if (invalid.isNotEmpty()) log.info("FCM invalid tokens to prune: {}", invalid.size)
            invalid
        } catch (e: Exception) {
            log.error("FCM multicast send error", e)
            emptyList()
        }
    }
}
