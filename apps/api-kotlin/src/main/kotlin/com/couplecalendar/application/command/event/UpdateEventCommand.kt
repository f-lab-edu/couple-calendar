package com.couplecalendar.application.command.event

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Event
import com.couplecalendar.domain.aggregate.EventCategory
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.EventRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

data class UpdateEventCommand(
    val userId: UUID,
    val coupleId: UUID,
    val eventId: UUID,
    val title: String? = null,
    val startTime: Instant? = null,
    val endTime: Instant? = null,
    val category: EventCategory? = null,
    val description: String? = null,
    val location: String? = null
) : Command<Event>

@Component
class UpdateEventCommandHandler(
    private val eventRepository: EventRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<UpdateEventCommand, Event> {

    @Transactional
    override fun handle(command: UpdateEventCommand): Event {
        val couple = coupleRepository.findById(command.coupleId)
            ?: throw NotFoundException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val event = eventRepository.findById(command.eventId)
            ?: throw NotFoundException("Event not found")

        if (!event.belongsToCouple(command.coupleId)) {
            throw ForbiddenException("Event does not belong to this couple")
        }

        event.update(
            title = command.title,
            startTime = command.startTime,
            endTime = command.endTime,
            category = command.category,
            description = command.description,
            location = command.location
        )

        eventRepository.update(event)
        return event
    }
}
