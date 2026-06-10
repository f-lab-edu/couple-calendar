package com.couplecalendar.infrastructure.persistence.mapper

import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.infrastructure.persistence.entity.UserEntity
import org.springframework.stereotype.Component

@Component
class UserMapper {

    fun toDomain(entity: UserEntity): User = User.reconstitute(
        id = entity.id,
        email = entity.email,
        name = entity.name,
        nickname = entity.nickname,
        birthday = entity.birthday,
        bio = entity.bio,
        partnerNickname = entity.partnerNickname,
        coupleId = entity.coupleId,
        createdAt = entity.createdAt,
        updatedAt = entity.updatedAt
    )

    fun toEntity(user: User): UserEntity = UserEntity(
        id = user.id,
        email = user.email.value,
        name = user.name,
        nickname = user.nickname,
        birthday = user.birthday,
        bio = user.bio,
        partnerNickname = user.partnerNickname,
        coupleId = user.coupleId,
        createdAt = user.createdAt,
        updatedAt = user.updatedAt
    )
}
