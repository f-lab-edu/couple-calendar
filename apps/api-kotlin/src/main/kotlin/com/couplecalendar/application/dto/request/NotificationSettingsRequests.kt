package com.couplecalendar.application.dto.request

/**
 * PATCH /api/users/me/notifications 요청 바디.
 * 모든 필드 optional — 전달된 필드만 갱신한다(PATCH 의미론).
 * reminder 는 자유 텍스트("하루 전", "당일" 등).
 */
data class UpdateNotificationSettingsRequest(
    val eventEnabled: Boolean? = null,
    val eventReminder: String? = null,
    val anniversaryEnabled: Boolean? = null,
    val anniversaryReminder: String? = null,
    val partnerActivityEnabled: Boolean? = null
)
