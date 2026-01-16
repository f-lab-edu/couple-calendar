package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.infrastructure.persistence.entity.UserEntity
import org.springframework.stereotype.Component

@Component
class UserMapper {

    fun toDomain(entity: UserEntity): User = User.reconstitute(
        id = entity.id,
        email = entity.email,
        nickname = entity.nickname,
        birthday = entity.birthday,
        coupleId = entity.coupleId,
        createdAt = entity.createdAt,
        updatedAt = entity.updatedAt
    )

    fun toEntity(user: User): UserEntity = UserEntity(
        id = user.id,
        email = user.email.value,
        nickname = user.nickname,
        birthday = user.birthday,
        coupleId = user.coupleId,
        createdAt = user.createdAt,
        updatedAt = user.updatedAt
    )
}
