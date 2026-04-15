package com.couplecalendar.application.command.anniversary

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.repository.AnniversaryRepository
import com.couplecalendar.domain.repository.CoupleRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

data class DeleteAnniversaryCommand(
    val userId: UUID,
    val coupleId: UUID,
    val anniversaryId: UUID
) : Command<Unit>

@Component
class DeleteAnniversaryCommandHandler(
    private val anniversaryRepository: AnniversaryRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<DeleteAnniversaryCommand, Unit> {

    @Transactional
    override fun handle(command: DeleteAnniversaryCommand) {
        val couple = coupleRepository.findById(command.coupleId)
            ?: throw NotFoundException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val anniversary = anniversaryRepository.findById(command.anniversaryId)
            ?: throw NotFoundException("Anniversary not found")

        if (!anniversary.belongsToCouple(command.coupleId)) {
            throw ForbiddenException("Anniversary does not belong to this couple")
        }

        anniversaryRepository.delete(command.anniversaryId)
    }
}
