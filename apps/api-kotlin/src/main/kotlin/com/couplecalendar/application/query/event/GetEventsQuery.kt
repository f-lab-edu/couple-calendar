package com.couplecalendar.application.query.event

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import com.couplecalendar.common.exception.ForbiddenException
import com.couplecalendar.infrastructure.persistence.repository.JpaCoupleRepository
import com.couplecalendar.infrastructure.persistence.repository.JpaEventRepository
import org.springframework.stereotype.Component
import java.time.Instant
import java.util.UUID

data class GetEventsQuery(
    val userId: UUID,
    val coupleId: UUID,
    val startDate: Instant? = null,
    val endDate: Instant? = null
) : Query<List<EventQueryResult>>

data class EventQueryResult(
    val id: String,
    val coupleId: String,
    val title: String,
    val startTime: String,
    val endTime: String,
    val category: String,
    val authorId: String,
    val description: String?,
    val location: String?,
    val createdAt: String,
    val updatedAt: String
)

@Component
class GetEventsQueryHandler(
    private val jpaEventRepository: JpaEventRepository,
    private val jpaCoupleRepository: JpaCoupleRepository
) : QueryHandler<GetEventsQuery, List<EventQueryResult>> {

    override fun handle(query: GetEventsQuery): List<EventQueryResult> {
        val couple = jpaCoupleRepository.findById(query.coupleId).orElse(null)
            ?: return emptyList()

        if (couple.user1Id != query.userId && couple.user2Id != query.userId) {
            throw ForbiddenException("User is not a member of this couple")
        }

        val events = if (query.startDate != null && query.endDate != null) {
            jpaEventRepository.findByCoupleIdAndDateRange(
                query.coupleId,
                query.startDate,
                query.endDate
            )
        } else {
            jpaEventRepository.findByCoupleIdOrderByStartTimeAsc(query.coupleId)
        }

        return events.map { entity ->
            EventQueryResult(
                id = entity.id.toString(),
                coupleId = entity.coupleId.toString(),
                title = entity.title,
                startTime = entity.startTime.toString(),
                endTime = entity.endTime.toString(),
                category = entity.category,
                authorId = entity.authorId.toString(),
                description = entity.memo,
                location = entity.location,
                createdAt = entity.createdAt.toString(),
                updatedAt = entity.updatedAt.toString()
            )
        }
    }
}
