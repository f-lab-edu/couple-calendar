package com.couplecalendar.application.query.user

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.infrastructure.persistence.repository.JpaUserRepository
import org.springframework.stereotype.Component
import java.util.UUID

data class GetUserQuery(val userId: UUID) : Query<UserQueryResult>

data class UserQueryResult(
    val id: String,
    val email: String,
    val nickname: String,
    val birthday: String?,
    val coupleId: String?,
    val createdAt: String,
    val updatedAt: String
)

@Component
class GetUserQueryHandler(
    private val jpaUserRepository: JpaUserRepository
) : QueryHandler<GetUserQuery, UserQueryResult> {

    override fun handle(query: GetUserQuery): UserQueryResult {
        val entity = jpaUserRepository.findById(query.userId).orElseThrow {
            NotFoundException("User not found")
        }

        return UserQueryResult(
            id = entity.id.toString(),
            email = entity.email,
            nickname = entity.nickname,
            birthday = entity.birthday?.toString(),
            coupleId = entity.coupleId?.toString(),
            createdAt = entity.createdAt.toString(),
            updatedAt = entity.updatedAt.toString()
        )
    }
}
