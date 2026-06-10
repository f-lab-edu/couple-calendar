package com.couplecalendar.domain.aggregate

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class NotificationSettingsTest {

    @Test
    fun `createDefault uses spec default values`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        assertTrue(settings.eventEnabled)
        assertEquals("하루 전", settings.eventReminder)
        assertTrue(settings.anniversaryEnabled)
        assertEquals("당일", settings.anniversaryReminder)
        assertTrue(settings.partnerActivityEnabled)
    }

    @Test
    fun `update only changes provided fields`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        settings.update(eventEnabled = false)

        assertTrue(!settings.eventEnabled)
        // unchanged
        assertEquals("하루 전", settings.eventReminder)
        assertTrue(settings.anniversaryEnabled)
        assertEquals("당일", settings.anniversaryReminder)
        assertTrue(settings.partnerActivityEnabled)
    }

    @Test
    fun `update changes reminder text`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        settings.update(eventReminder = "1시간 전", anniversaryReminder = "일주일 전")

        assertEquals("1시간 전", settings.eventReminder)
        assertEquals("일주일 전", settings.anniversaryReminder)
    }

    @Test
    fun `update rejects blank eventReminder`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        val ex = assertThrows(IllegalArgumentException::class.java) {
            settings.update(eventReminder = " ")
        }
        assertEquals("Event reminder cannot be blank", ex.message)
    }

    @Test
    fun `update rejects blank anniversaryReminder`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        val ex = assertThrows(IllegalArgumentException::class.java) {
            settings.update(anniversaryReminder = "")
        }
        assertEquals("Anniversary reminder cannot be blank", ex.message)
    }

    @Test
    fun `update toggles all booleans`() {
        val settings = NotificationSettings.createDefault(UUID.randomUUID())

        settings.update(
            eventEnabled = false,
            anniversaryEnabled = false,
            partnerActivityEnabled = false
        )

        assertTrue(!settings.eventEnabled)
        assertTrue(!settings.anniversaryEnabled)
        assertTrue(!settings.partnerActivityEnabled)
    }
}
