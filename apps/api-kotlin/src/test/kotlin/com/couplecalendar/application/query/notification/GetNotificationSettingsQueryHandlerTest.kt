package com.couplecalendar.application.query.notification

import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertSame
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class GetNotificationSettingsQueryHandlerTest {

    private val repository = mockk<NotificationSettingsRepository>(relaxed = true)
    private val handler = GetNotificationSettingsQueryHandler(repository)

    @Test
    fun `returns existing settings without saving`() {
        val userId = UUID.randomUUID()
        val existing = NotificationSettings.createDefault(userId)
        every { repository.findByUserId(userId) } returns existing

        val result = handler.handle(GetNotificationSettingsQuery(userId))

        assertSame(existing, result)
        verify(exactly = 0) { repository.save(any()) }
    }

    @Test
    fun `creates default settings via upsert when none exist`() {
        val userId = UUID.randomUUID()
        every { repository.findByUserId(userId) } returns null

        val result = handler.handle(GetNotificationSettingsQuery(userId))

        // default values
        assertTrue(result.eventEnabled)
        assertEquals("하루 전", result.eventReminder)
        assertTrue(result.anniversaryEnabled)
        assertEquals("당일", result.anniversaryReminder)
        assertTrue(result.partnerActivityEnabled)
        assertEquals(userId, result.userId)

        val saved = slot<NotificationSettings>()
        verify(exactly = 1) { repository.save(capture(saved)) }
        assertEquals(userId, saved.captured.userId)
    }
}
