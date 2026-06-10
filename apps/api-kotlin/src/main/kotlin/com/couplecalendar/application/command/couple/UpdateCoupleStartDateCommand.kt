package com.couplecalendar.application.command.couple

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.repository.CoupleRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

data class UpdateCoupleStartDateCommand(
    val userId: UUID,
    val startDate: LocalDate
) : Command<Couple>

@Component
class UpdateCoupleStartDateCommandHandler(
    private val coupleRepository: CoupleRepository
) : CommandHandler<UpdateCoupleStartDateCommand, Couple> {

    @Transactional
    override fun handle(command: UpdateCoupleStartDateCommand): Couple {
        if (command.startDate.isAfter(LocalDate.now())) {
            throw BadRequestException("Start date cannot be in the future")
        }

        val couple = coupleRepository.findByUserId(command.userId)
            ?: throw NotFoundException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        couple.updateStartDate(command.startDate)
        coupleRepository.update(couple)
        return couple
    }
}
