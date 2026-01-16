package com.couplecalendar.domain.valueobject

import java.time.Instant
import java.time.temporal.ChronoUnit

data class InviteCode private constructor(
    val value: String,
    val expiresAt: Instant
) {
    fun isExpired(): Boolean = Instant.now().isAfter(expiresAt)
    fun isValid(): Boolean = !isExpired()

    companion object {
        private const val CODE_LENGTH = 6
        private const val CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        private const val EXPIRY_HOURS = 24L

        fun generate(): InviteCode {
            val code = (1..CODE_LENGTH)
                .map { CHARS.random() }
                .joinToString("")
            val expiresAt = Instant.now().plus(EXPIRY_HOURS, ChronoUnit.HOURS)
            return InviteCode(code, expiresAt)
        }

        fun fromExisting(code: String, expiresAt: Instant): InviteCode =
            InviteCode(code, expiresAt)
    }
}
