package com.couplecalendar.application.command.anniversary

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Anniversary
import com.couplecalendar.domain.repository.AnniversaryRepository
import com.couplecalendar.domain.repository.CoupleRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

data class UpdateAnniversaryCommand(
    val userId: UUID,
    val coupleId: UUID,
    val anniversaryId: UUID,
    val title: String? = null,
    val date: LocalDate? = null,
    val isRecurring: Boolean? = null,
    val description: String? = null
) : Command<Anniversary>

@Component
class UpdateAnniversaryCommandHandler(
    private val anniversaryRepository: AnniversaryRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<UpdateAnniversaryCommand, Anniversary> {

    @Transactional
    override fun handle(command: UpdateAnniversaryCommand): Anniversary {
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

        anniversary.update(
            title = command.title,
            date = command.date,
            isRecurring = command.isRecurring,
            description = command.description
        )

        anniversaryRepository.update(anniversary)
        return anniversary
    }
}
