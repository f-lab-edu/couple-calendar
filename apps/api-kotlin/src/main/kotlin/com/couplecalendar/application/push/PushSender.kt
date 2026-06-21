package com.couplecalendar.application.push

/**
 * 푸시 발송 추상화. 구현은 FCM(FcmPushSender). 자격증명이 없으면 no-op 구현이 주입된다.
 */
interface PushSender {
    /**
     * 토큰들에 알림을 보낸다.
     * @return FCM이 무효(미등록/잘못된 토큰)라고 응답한 토큰들 — 정리(삭제) 대상.
     */
    fun send(
        tokens: List<String>,
        title: String,
        body: String,
        data: Map<String, String> = emptyMap()
    ): List<String>

    val enabled: Boolean
}
