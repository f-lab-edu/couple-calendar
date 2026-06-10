package com.couplecalendar.application.command.couple

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.UserRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

data class DisconnectCoupleCommand(
    val userId: UUID
) : Command<Unit>

@Component
class DisconnectCoupleCommandHandler(
    private val coupleRepository: CoupleRepository,
    private val userRepository: UserRepository
) : CommandHandler<DisconnectCoupleCommand, Unit> {

    @Transactional
    override fun handle(command: DisconnectCoupleCommand) {
        val couple = coupleRepository.findByUserId(command.userId)
            ?: throw NotFoundException("Couple not found")

        if (!couple.hasUser(command.userId)) {
            throw ForbiddenException("User is not a member of this couple")
        }

        // 양쪽 사용자의 coupleId 를 해제한다.
        listOfNotNull(couple.user1Id, couple.user2Id).forEach { memberId ->
            userRepository.findById(memberId)?.let { member ->
                member.leaveCouple()
                userRepository.update(member)
            }
        }

        // 커플 레코드 삭제.
        coupleRepository.delete(couple.id)
    }
}
