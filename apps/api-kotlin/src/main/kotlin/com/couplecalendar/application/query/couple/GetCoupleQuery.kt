package com.couplecalendar.application.query.couple

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.infrastructure.persistence.repository.JpaCoupleRepository
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.UUID

data class GetCoupleQuery(
    val userId: UUID,
    val coupleId: UUID
) : Query<CoupleQueryResult>

data class CoupleQueryResult(
    val id: String,
    val user1Id: String,
    val user2Id: String?,
    val startDate: String,
    val inviteCode: String?,
    val inviteCodeExpiresAt: String?,
    val daysFromStart: Long,
    val isComplete: Boolean,
    val createdAt: String,
    val updatedAt: String
)

@Component
class GetCoupleQueryHandler(
    private val jpaCoupleRepository: JpaCoupleRepository
) : QueryHandler<GetCoupleQuery, CoupleQueryResult> {

    override fun handle(query: GetCoupleQuery): CoupleQueryResult {
        val entity = jpaCoupleRepository.findById(query.coupleId).orElseThrow {
            NotFoundException("Couple not found")
        }

        if (entity.user1Id != query.userId && entity.user2Id != query.userId) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val daysFromStart = ChronoUnit.DAYS.between(entity.startDate, LocalDate.now())

        return CoupleQueryResult(
            id = entity.id.toString(),
            user1Id = entity.user1Id.toString(),
            user2Id = entity.user2Id?.toString(),
            startDate = entity.startDate.toString(),
            inviteCode = entity.inviteCode,
            inviteCodeExpiresAt = entity.inviteCodeExpiresAt?.toString(),
            daysFromStart = daysFromStart,
            isComplete = entity.user2Id != null,
            createdAt = entity.createdAt.toString(),
            updatedAt = entity.updatedAt.toString()
        )
    }
}
