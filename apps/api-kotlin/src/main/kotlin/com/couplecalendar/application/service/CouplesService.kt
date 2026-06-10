package com.couplecalendar.application.service

import com.couplecalendar.application.command.couple.ConnectCoupleCommand
import com.couplecalendar.application.command.couple.ConnectCoupleCommandHandler
import com.couplecalendar.application.command.couple.CreateCoupleCommand
import com.couplecalendar.application.command.couple.CreateCoupleCommandHandler
import com.couplecalendar.application.command.couple.DisconnectCoupleCommand
import com.couplecalendar.application.command.couple.DisconnectCoupleCommandHandler
import com.couplecalendar.application.command.couple.UpdateCoupleStartDateCommand
import com.couplecalendar.application.command.couple.UpdateCoupleStartDateCommandHandler
import com.couplecalendar.application.dto.request.CreateCoupleRequest
import com.couplecalendar.application.dto.response.CoupleResponse
import com.couplecalendar.application.dto.response.InviteCodeResponse
import com.couplecalendar.application.query.couple.CoupleQueryResult
import com.couplecalendar.application.query.couple.GetCoupleQuery
import com.couplecalendar.application.query.couple.GetCoupleQueryHandler
import com.couplecalendar.application.query.couple.GetMyCoupleQuery
import com.couplecalendar.application.query.couple.GetMyCoupleQueryHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.service.DDayCalculatorService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.UUID

@Service
class CouplesService(
    private val createCoupleCommandHandler: CreateCoupleCommandHandler,
    private val connectCoupleCommandHandler: ConnectCoupleCommandHandler,
    private val updateCoupleStartDateCommandHandler: UpdateCoupleStartDateCommandHandler,
    private val disconnectCoupleCommandHandler: DisconnectCoupleCommandHandler,
    private val getCoupleQueryHandler: GetCoupleQueryHandler,
    private val getMyCoupleQueryHandler: GetMyCoupleQueryHandler,
    private val dDayCalculatorService: DDayCalculatorService
) {

    fun createInvite(userId: UUID, request: CreateCoupleRequest): InviteCodeResponse {
        val startDate = parseDate(request.startDate)
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

    fun getCouple(userId: UUID, coupleId: UUID): CoupleResponse =
        getCoupleQueryHandler.handle(GetCoupleQuery(userId, coupleId)).toResponse()

    fun getMyCouple(userId: UUID): CoupleResponse =
        getMyCoupleQueryHandler.handle(GetMyCoupleQuery(userId)).toResponse()

    fun updateMyCoupleStartDate(userId: UUID, startDate: String): CoupleResponse {
        val command = UpdateCoupleStartDateCommand(userId, parseDate(startDate))
        val couple = updateCoupleStartDateCommandHandler.handle(command)
        return CoupleResponse.fromAggregate(couple)
    }

    fun disconnectMyCouple(userId: UUID) {
        disconnectCoupleCommandHandler.handle(DisconnectCoupleCommand(userId))
    }

    private fun parseDate(value: String): LocalDate =
        try {
            LocalDate.parse(value)
        } catch (e: DateTimeParseException) {
            throw BadRequestException("Invalid date format. Expected YYYY-MM-DD")
        }

    private fun CoupleQueryResult.toResponse(): CoupleResponse = CoupleResponse(
        id = id,
        user1Id = user1Id,
        user2Id = user2Id,
        startDate = startDate,
        inviteCode = inviteCode,
        inviteCodeExpiresAt = inviteCodeExpiresAt,
        daysFromStart = daysFromStart,
        isComplete = isComplete,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}
