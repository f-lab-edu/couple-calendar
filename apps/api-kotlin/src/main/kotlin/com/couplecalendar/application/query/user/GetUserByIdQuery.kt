package com.couplecalendar.application.query.user

import com.couplecalendar.application.query.Query
import com.couplecalendar.application.query.QueryHandler
import org.springframework.stereotype.Component
import java.util.UUID

/**
 * 임의의 사용자를 UUID 로 조회한다(파트너 프로필 조회 등).
 * 조회 로직 자체는 GetUserQueryHandler 와 동일하므로 재사용한다.
 */
data class GetUserByIdQuery(val userId: UUID) : Query<UserQueryResult>

@Component
class GetUserByIdQueryHandler(
    private val getUserQueryHandler: GetUserQueryHandler
) : QueryHandler<GetUserByIdQuery, UserQueryResult> {

    override fun handle(query: GetUserByIdQuery): UserQueryResult =
        getUserQueryHandler.handle(GetUserQuery(query.userId))
}
