package com.couplecalendar.application.command.couple

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.UserRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

data class CreateCoupleCommand(
    val userId: UUID,
    val startDate: LocalDate
) : Command<Couple>

@Component
class CreateCoupleCommandHandler(
    private val coupleRepository: CoupleRepository,
    private val userRepository: UserRepository
) : CommandHandler<CreateCoupleCommand, Couple> {

    @Transactional
    override fun handle(command: CreateCoupleCommand): Couple {
        val user = userRepository.findById(command.userId)
            ?: throw BadRequestException("User not found")

        if (user.isInCouple()) {
            throw BadRequestException("User is already in a couple")
        }

        val couple = Couple.create(command.userId, command.startDate)
        coupleRepository.save(couple)

        user.joinCouple(couple.id)
        userRepository.update(user)

        return couple
    }
}
