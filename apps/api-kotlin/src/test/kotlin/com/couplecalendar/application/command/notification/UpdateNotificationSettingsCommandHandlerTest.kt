package com.couplecalendar.application.command.notification

import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.aggregate.NotificationSettings
import com.couplecalendar.domain.repository.NotificationSettingsRepository
import io.mockk.every
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class UpdateNotificationSettingsCommandHandlerTest {

    private val repository = mockk<NotificationSettingsRepository>(relaxed = true)
    private val handler = UpdateNotificationSettingsCommandHandler(repository)

    @Test
    fun `partial update on existing settings calls update not save`() {
        val userId = UUID.randomUUID()
        val existing = NotificationSettings.createDefault(userId)
        every { repository.findByUserId(userId) } returns existing

        val result = handler.handle(
            UpdateNotificationSettingsCommand(userId, eventEnabled = false)
        )

        assertTrue(!result.eventEnabled)
        // other fields unchanged
        assertEquals("하루 전", result.eventReminder)
        assertTrue(result.partnerActivityEnabled)
        verify(exactly = 1) { repository.update(existing) }
        verify(exactly = 0) { repository.save(any()) }
    }

    @Test
    fun `upserts default then applies update when none exist`() {
        val userId = UUID.randomUUID()
        every { repository.findByUserId(userId) } returns null

        val result = handler.handle(
            UpdateNotificationSettingsCommand(userId, eventReminder = "1시간 전")
        )

        assertEquals("1시간 전", result.eventReminder)
        // remaining defaults preserved
        assertEquals("당일", result.anniversaryReminder)
        val saved = slot<NotificationSettings>()
        verify(exactly = 1) { repository.save(capture(saved)) }
        verify(exactly = 0) { repository.update(any()) }
        assertEquals("1시간 전", saved.captured.eventReminder)
    }

    @Test
    fun `blank reminder is rejected as BadRequest`() {
        val userId = UUID.randomUUID()
        every { repository.findByUserId(userId) } returns NotificationSettings.createDefault(userId)

        assertThrows(BadRequestException::class.java) {
            handler.handle(UpdateNotificationSettingsCommand(userId, eventReminder = " "))
        }
        verify(exactly = 0) { repository.update(any()) }
    }

    @Test
    fun `update with no fields leaves defaults intact`() {
        val userId = UUID.randomUUID()
        val existing = NotificationSettings.createDefault(userId)
        every { repository.findByUserId(userId) } returns existing

        val result = handler.handle(UpdateNotificationSettingsCommand(userId))

        assertTrue(result.eventEnabled)
        assertEquals("하루 전", result.eventReminder)
        verify(exactly = 1) { repository.update(existing) }
    }
}
