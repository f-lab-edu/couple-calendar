package com.couplecalendar.application.command.couple

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.service.CoupleMatchingService
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

data class ConnectCoupleCommand(
    val userId: UUID,
    val inviteCode: String
) : Command<Couple>

@Component
class ConnectCoupleCommandHandler(
    private val coupleMatchingService: CoupleMatchingService
) : CommandHandler<ConnectCoupleCommand, Couple> {

    @Transactional
    override fun handle(command: ConnectCoupleCommand): Couple {
        val validation = coupleMatchingService.validateCanConnect(command.userId, command.inviteCode)
        return coupleMatchingService.executeConnection(validation.user, validation.couple)
    }
}
