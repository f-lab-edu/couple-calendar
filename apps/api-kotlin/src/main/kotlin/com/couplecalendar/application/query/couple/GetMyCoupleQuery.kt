package com.couplecalendar.application.query.couple

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.infrastructure.persistence.repository.JpaCoupleRepository
import org.springframework.stereotype.Component
import java.time.LocalDate
import java.time.temporal.ChronoUnit
import java.util.UUID

/** 현재 로그인 사용자가 속한 커플을 조회한다. */
data class GetMyCoupleQuery(val userId: UUID) : Query<CoupleQueryResult>

@Component
class GetMyCoupleQueryHandler(
    private val jpaCoupleRepository: JpaCoupleRepository
) : QueryHandler<GetMyCoupleQuery, CoupleQueryResult> {

    override fun handle(query: GetMyCoupleQuery): CoupleQueryResult {
        val entity = jpaCoupleRepository.findByUserId(query.userId)
            ?: throw NotFoundException("Couple not found")

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
