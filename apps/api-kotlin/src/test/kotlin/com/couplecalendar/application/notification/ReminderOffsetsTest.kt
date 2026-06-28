package com.couplecalendar.application.notification

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.time.Duration

class ReminderOffsetsTest {
    @Test
    fun `parses standard reminder strings`() {
        assertEquals(Duration.ofMinutes(10), ReminderOffsets.parse("10분 전"))
        assertEquals(Duration.ofHours(1), ReminderOffsets.parse("1시간 전"))
        assertEquals(Duration.ofDays(1), ReminderOffsets.parse("하루 전"))
        assertEquals(Duration.ofDays(7), ReminderOffsets.parse("일주일 전"))
        assertEquals(Duration.ZERO, ReminderOffsets.parse("당일"))
    }

    @Test
    fun `none and unparseable return null`() {
        assertNull(ReminderOffsets.parse("없음"))
        assertNull(ReminderOffsets.parse(""))
        assertNull(ReminderOffsets.parse(null))
        assertNull(ReminderOffsets.parse("내일쯤"))
    }

    @Test
    fun `parses generic N-unit forms`() {
        assertEquals(Duration.ofMinutes(30), ReminderOffsets.parse("30분 전"))
        assertEquals(Duration.ofHours(3), ReminderOffsets.parse("3시간 전"))
        assertEquals(Duration.ofDays(2), ReminderOffsets.parse("2일 전"))
        assertEquals(Duration.ofDays(14), ReminderOffsets.parse("2주 전"))
    }
}
