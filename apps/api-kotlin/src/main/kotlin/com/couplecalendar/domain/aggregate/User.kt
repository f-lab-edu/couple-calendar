package com.couplecalendar.domain.aggregate

import com.couplecalendar.domain.valueobject.Email
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

class User private constructor(
    val id: UUID,
    val email: Email,
    private var _name: String,
    private var _nickname: String,
    private var _birthday: LocalDate?,
    private var _bio: String?,
    private var _partnerNickname: String?,
    private var _coupleId: UUID?,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val name: String get() = _name
    val nickname: String get() = _nickname
    val birthday: LocalDate? get() = _birthday
    val bio: String? get() = _bio
    val partnerNickname: String? get() = _partnerNickname
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

    /**
     * 프로필을 부분 갱신한다(PATCH 의미론).
     * - name/nickname: 제공 시 빈 문자열 불가
     * - birthday: 미래 불가, null 허용(초기화)
     * - bio/partnerNickname: null 허용(초기화)
     *
     * present 플래그로 "필드 미전달"과 "null 로 명시 초기화"를 구분한다.
     */
    fun updateProfile(
        name: String? = null,
        nickname: String? = null,
        birthday: LocalDate? = null,
        birthdayPresent: Boolean = false,
        bio: String? = null,
        bioPresent: Boolean = false,
        partnerNickname: String? = null,
        partnerNicknamePresent: Boolean = false
    ) {
        name?.let {
            require(it.isNotBlank()) { "Name cannot be blank" }
            _name = it
        }
        nickname?.let {
            require(it.isNotBlank()) { "Nickname cannot be blank" }
            _nickname = it
        }
        if (birthdayPresent) {
            require(birthday == null || !birthday.isAfter(LocalDate.now())) {
                "Birthday cannot be in the future"
            }
            _birthday = birthday
        }
        if (bioPresent) {
            _bio = bio
        }
        if (partnerNicknamePresent) {
            _partnerNickname = partnerNickname
        }
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
        fun create(
            email: String,
            nickname: String,
            name: String? = null,
            birthday: LocalDate? = null
        ): User {
            val now = Instant.now()
            return User(
                id = UUID.randomUUID(),
                email = Email.create(email),
                _name = name ?: nickname,
                _nickname = nickname,
                _birthday = birthday,
                _bio = null,
                _partnerNickname = null,
                _coupleId = null,
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            id: UUID,
            email: String,
            name: String,
            nickname: String,
            birthday: LocalDate?,
            bio: String?,
            partnerNickname: String?,
            coupleId: UUID?,
            createdAt: Instant,
            updatedAt: Instant
        ): User = User(
            id = id,
            email = Email.fromExisting(email),
            _name = name,
            _nickname = nickname,
            _birthday = birthday,
            _bio = bio,
            _partnerNickname = partnerNickname,
            _coupleId = coupleId,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
