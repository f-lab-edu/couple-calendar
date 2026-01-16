package com.couplecalendar.application.command.event

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.domain.aggregate.Event
import com.couplecalendar.domain.aggregate.EventCategory
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.EventRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

data class CreateEventCommand(
    val userId: UUID,
    val coupleId: UUID,
    val title: String,
    val startTime: Instant,
    val endTime: Instant,
    val category: EventCategory,
    val description: String? = null,
    val location: String? = null
) : Command<Event>

@Component
class CreateEventCommandHandler(
    private val eventRepository: EventRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<CreateEventCommand, Event> {

    @Transactional
    override fun handle(command: CreateEventCommand): Event {
        val couple = coupleRepository.findById(command.coupleId)
            ?: throw BadRequestException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val event = Event.create(
            coupleId = command.coupleId,
            title = command.title,
            startTime = command.startTime,
            endTime = command.endTime,
            category = command.category,
            authorId = command.userId,
            description = command.description,
            location = command.location
        )

        eventRepository.save(event)
        return event
    }
}
