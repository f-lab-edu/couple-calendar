package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.CreateEventRequest
import com.couplecalendar.application.dto.request.EventQueryRequest
import com.couplecalendar.application.dto.request.UpdateEventRequest
import com.couplecalendar.application.dto.response.EventResponse
import com.couplecalendar.application.service.EventsService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/events")
class EventsController(
    private val eventsService: EventsService
) {

    @GetMapping
    fun getEvents(
        @CurrentUser user: UserPrincipal,
        @RequestParam(required = false) startDate: String?,
        @RequestParam(required = false) endDate: String?
    ): List<EventResponse> {
        val queryRequest = EventQueryRequest(startDate, endDate)
        return eventsService.getEvents(user.id, queryRequest)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createEvent(
        @CurrentUser user: UserPrincipal,
        @Valid @RequestBody request: CreateEventRequest
    ): EventResponse =
        eventsService.createEvent(user.id, request)

    @PatchMapping("/{id}")
    fun updateEvent(
        @CurrentUser user: UserPrincipal,
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateEventRequest
    ): EventResponse =
        eventsService.updateEvent(user.id, id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteEvent(
        @CurrentUser user: UserPrincipal,
        @PathVariable id: UUID
    ) {
        eventsService.deleteEvent(user.id, id)
    }
}
