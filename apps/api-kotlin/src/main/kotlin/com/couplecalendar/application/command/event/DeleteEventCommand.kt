package com.couplecalendar.application.command.event

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.EventRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

data class DeleteEventCommand(
    val userId: UUID,
    val coupleId: UUID,
    val eventId: UUID
) : Command<Unit>

@Component
class DeleteEventCommandHandler(
    private val eventRepository: EventRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<DeleteEventCommand, Unit> {

    @Transactional
    override fun handle(command: DeleteEventCommand) {
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

        eventRepository.delete(command.eventId)
    }
}
