package com.couplecalendar.application.command.anniversary

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.domain.aggregate.Anniversary
import com.couplecalendar.domain.repository.AnniversaryRepository
import com.couplecalendar.domain.repository.CoupleRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

data class CreateAnniversaryCommand(
    val userId: UUID,
    val coupleId: UUID,
    val title: String,
    val date: LocalDate,
    val isRecurring: Boolean,
    val description: String? = null
) : Command<Anniversary>

@Component
class CreateAnniversaryCommandHandler(
    private val anniversaryRepository: AnniversaryRepository,
    private val coupleRepository: CoupleRepository
) : CommandHandler<CreateAnniversaryCommand, Anniversary> {

    @Transactional
    override fun handle(command: CreateAnniversaryCommand): Anniversary {
        val couple = coupleRepository.findById(command.coupleId)
            ?: throw BadRequestException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val anniversary = Anniversary.create(
            coupleId = command.coupleId,
            title = command.title,
            date = command.date,
            isRecurring = command.isRecurring,
            description = command.description
        )

        anniversaryRepository.save(anniversary)
        return anniversary
    }
}
