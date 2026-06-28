package com.couplecalendar.application.notification

import java.time.Duration

/**
 * 알림 설정에 저장된 리마인더 문자열을 "이벤트 시작 이전 오프셋"으로 변환한다.
 * 웹 옵션과 1:1 대응: "없음","10분 전","1시간 전","하루 전","일주일 전","당일".
 */
object ReminderOffsets {
    /**
     * @return 시작 시각으로부터 얼마나 앞서 알릴지(Duration). "없음"이거나 해석 불가면 null.
     *         "당일"은 ZERO(시작 시각/당일).
     */
    fun parse(reminder: String?): Duration? {
        val s = reminder?.trim() ?: return null
        return when {
            s.isEmpty() || s == "없음" -> null
            s == "당일" -> Duration.ZERO
            s == "하루 전" -> Duration.ofDays(1)
            s == "일주일 전" -> Duration.ofDays(7)
            else -> {
                val m = Regex("^(\\d+)\\s*(분|시간|일|주)\\s*전$").find(s) ?: return null
                val n = m.groupValues[1].toLong()
                when (m.groupValues[2]) {
                    "분" -> Duration.ofMinutes(n)
                    "시간" -> Duration.ofHours(n)
                    "일" -> Duration.ofDays(n)
                    "주" -> Duration.ofDays(n * 7)
                    else -> null
                }
            }
        }
    }
}
