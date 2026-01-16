package com.couplecalendar.application.service

import com.couplecalendar.application.command.event.CreateEventCommand
import com.couplecalendar.application.command.event.CreateEventCommandHandler
import com.couplecalendar.application.command.event.DeleteEventCommand
import com.couplecalendar.application.command.event.DeleteEventCommandHandler
import com.couplecalendar.application.command.event.UpdateEventCommand
import com.couplecalendar.application.command.event.UpdateEventCommandHandler
import com.couplecalendar.application.dto.request.CreateEventRequest
import com.couplecalendar.application.dto.request.EventQueryRequest
import com.couplecalendar.application.dto.request.UpdateEventRequest
import com.couplecalendar.application.dto.response.EventResponse
import com.couplecalendar.application.query.event.GetEventsQuery
import com.couplecalendar.application.query.event.GetEventsQueryHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.aggregate.EventCategory
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.UUID

@Service
class EventsService(
    private val createEventCommandHandler: CreateEventCommandHandler,
    private val updateEventCommandHandler: UpdateEventCommandHandler,
    private val deleteEventCommandHandler: DeleteEventCommandHandler,
    private val getEventsQueryHandler: GetEventsQueryHandler,
    private val usersService: UsersService
) {

    fun getEvents(userId: UUID, queryRequest: EventQueryRequest): List<EventResponse> {
        val coupleId = requireCoupleId(userId)

        val startDate = queryRequest.startDate?.let { Instant.parse(it) }
        val endDate = queryRequest.endDate?.let { Instant.parse(it) }

        val query = GetEventsQuery(userId, coupleId, startDate, endDate)
        val results = getEventsQueryHandler.handle(query)

        return results.map { result ->
            EventResponse(
                id = result.id,
                coupleId = result.coupleId,
                title = result.title,
                startTime = result.startTime,
                endTime = result.endTime,
                category = result.category,
                authorId = result.authorId,
                description = result.description,
                location = result.location,
                createdAt = result.createdAt,
                updatedAt = result.updatedAt
            )
        }
    }

    fun createEvent(userId: UUID, request: CreateEventRequest): EventResponse {
        val coupleId = requireCoupleId(userId)

        val command = CreateEventCommand(
            userId = userId,
            coupleId = coupleId,
            title = request.title,
            startTime = Instant.parse(request.startTime),
            endTime = Instant.parse(request.endTime),
            category = EventCategory.valueOf(request.category.uppercase()),
            description = request.description,
            location = request.location
        )

        val event = createEventCommandHandler.handle(command)
        return EventResponse.fromAggregate(event)
    }

    fun updateEvent(userId: UUID, eventId: UUID, request: UpdateEventRequest): EventResponse {
        val coupleId = requireCoupleId(userId)

        val command = UpdateEventCommand(
            userId = userId,
            coupleId = coupleId,
            eventId = eventId,
            title = request.title,
            startTime = request.startTime?.let { Instant.parse(it) },
            endTime = request.endTime?.let { Instant.parse(it) },
            category = request.category?.let { EventCategory.valueOf(it.uppercase()) },
            description = request.description,
            location = request.location
        )

        val event = updateEventCommandHandler.handle(command)
        return EventResponse.fromAggregate(event)
    }

    fun deleteEvent(userId: UUID, eventId: UUID) {
        val coupleId = requireCoupleId(userId)

        val command = DeleteEventCommand(userId, coupleId, eventId)
        deleteEventCommandHandler.handle(command)
    }

    private fun requireCoupleId(userId: UUID): UUID {
        return usersService.getUserCoupleId(userId)
            ?: throw BadRequestException("User is not in a couple")
    }
}
