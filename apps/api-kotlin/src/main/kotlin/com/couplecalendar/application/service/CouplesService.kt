package com.couplecalendar.application.service

import com.couplecalendar.application.command.couple.ConnectCoupleCommand
import com.couplecalendar.application.command.couple.ConnectCoupleCommandHandler
import com.couplecalendar.application.command.couple.CreateCoupleCommand
import com.couplecalendar.application.command.couple.CreateCoupleCommandHandler
import com.couplecalendar.application.dto.request.CreateCoupleRequest
import com.couplecalendar.application.dto.response.CoupleResponse
import com.couplecalendar.application.dto.response.InviteCodeResponse
import com.couplecalendar.application.query.couple.GetCoupleQuery
import com.couplecalendar.application.query.couple.GetCoupleQueryHandler
import com.couplecalendar.domain.service.DDayCalculatorService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.util.UUID

@Service
class CouplesService(
    private val createCoupleCommandHandler: CreateCoupleCommandHandler,
    private val connectCoupleCommandHandler: ConnectCoupleCommandHandler,
    private val getCoupleQueryHandler: GetCoupleQueryHandler,
    private val dDayCalculatorService: DDayCalculatorService
) {

    fun createInvite(userId: UUID, request: CreateCoupleRequest): InviteCodeResponse {
        val startDate = LocalDate.parse(request.startDate)
        val command = CreateCoupleCommand(userId, startDate)
        val couple = createCoupleCommandHandler.handle(command)

        return InviteCodeResponse(
            inviteCode = couple.inviteCode!!,
            expiresAt = couple.inviteCodeExpiresAt!!.toString()
        )
    }

    fun connectWithPartner(userId: UUID, inviteCode: String): CoupleResponse {
        val command = ConnectCoupleCommand(userId, inviteCode)
        val couple = connectCoupleCommandHandler.handle(command)
        return CoupleResponse.fromAggregate(couple)
    }

    fun getCouple(userId: UUID, coupleId: UUID): CoupleResponse {
        val query = GetCoupleQuery(userId, coupleId)
        val result = getCoupleQueryHandler.handle(query)

        return CoupleResponse(
            id = result.id,
            user1Id = result.user1Id,
            user2Id = result.user2Id,
            startDate = result.startDate,
            inviteCode = result.inviteCode,
            inviteCodeExpiresAt = result.inviteCodeExpiresAt,
            daysFromStart = dDayCalculatorService.calculateDaysFromStart(LocalDate.parse(result.startDate)),
            isComplete = result.isComplete,
            createdAt = result.createdAt,
            updatedAt = result.updatedAt
        )
    }
}
