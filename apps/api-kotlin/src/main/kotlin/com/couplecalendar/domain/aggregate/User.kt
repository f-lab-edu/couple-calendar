package com.couplecalendar.domain.aggregate

import com.couplecalendar.domain.valueobject.Email
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

class User private constructor(
    val id: UUID,
    val email: Email,
    private var _nickname: String,
    private var _birthday: LocalDate?,
    private var _coupleId: UUID?,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val nickname: String get() = _nickname
    val birthday: LocalDate? get() = _birthday
    val coupleId: UUID? get() = _coupleId
    val updatedAt: Instant get() = _updatedAt

    fun updateNickname(nickname: String) {
        require(nickname.isNotBlank()) { "Nickname cannot be blank" }
        _nickname = nickname
        _updatedAt = Instant.now()
    }

    fun updateBirthday(birthday: LocalDate) {
        _birthday = birthday
        _updatedAt = Instant.now()
    }

    fun joinCouple(coupleId: UUID) {
        require(_coupleId == null) { "User is already in a couple" }
        _coupleId = coupleId
        _updatedAt = Instant.now()
    }

    fun leaveCouple() {
        _coupleId = null
        _updatedAt = Instant.now()
    }

    fun isInCouple(): Boolean = _coupleId != null

    companion object {
        fun create(email: String, nickname: String, birthday: LocalDate? = null): User {
            val now = Instant.now()
            return User(
                id = UUID.randomUUID(),
                email = Email.create(email),
                _nickname = nickname,
                _birthday = birthday,
                _coupleId = null,
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            id: UUID,
            email: String,
            nickname: String,
            birthday: LocalDate?,
            coupleId: UUID?,
            createdAt: Instant,
            updatedAt: Instant
        ): User = User(
            id = id,
            email = Email.fromExisting(email),
            _nickname = nickname,
            _birthday = birthday,
            _coupleId = coupleId,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
