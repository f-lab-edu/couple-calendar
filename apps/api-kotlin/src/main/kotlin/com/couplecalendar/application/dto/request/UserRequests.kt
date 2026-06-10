package com.couplecalendar.application.dto.request

import com.fasterxml.jackson.annotation.JsonAnySetter

/**
 * PATCH /api/users/me 요청 바디.
 * 모든 필드는 선택적이며, 전달된 필드만 갱신한다(PATCH 의미론).
 *
 * birthday/bio/partnerNickname 은 "미전달"과 "null 로 초기화"를 구분해야 하므로
 * 단순 nullable 필드로는 표현할 수 없다. @JsonAnySetter 로 raw 값을 수집해
 * presence(키 존재 여부)를 추적한다.
 *
 * - name/nickname: 제공 시 빈 문자열 불가(Command 단계에서 검증).
 * - birthday: "YYYY-MM-DD", null 허용(초기화), 미래 불가.
 * - bio/partnerNickname: null 허용(초기화).
 */
class UpdateUserRequest {
    private val fields = mutableMapOf<String, Any?>()

    @JsonAnySetter
    fun set(key: String, value: Any?) {
        fields[key] = value
    }

    private fun stringOf(key: String): String? = fields[key]?.let { it as? String }

    val namePresent: Boolean get() = fields.containsKey("name")
    val nicknamePresent: Boolean get() = fields.containsKey("nickname")
    val birthdayPresent: Boolean get() = fields.containsKey("birthday")
    val bioPresent: Boolean get() = fields.containsKey("bio")
    val partnerNicknamePresent: Boolean get() = fields.containsKey("partnerNickname")

    val name: String? get() = stringOf("name")
    val nickname: String? get() = stringOf("nickname")
    val birthday: String? get() = stringOf("birthday")
    val bio: String? get() = stringOf("bio")
    val partnerNickname: String? get() = stringOf("partnerNickname")
}
