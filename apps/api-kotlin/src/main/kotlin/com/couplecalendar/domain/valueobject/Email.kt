package com.couplecalendar.domain.valueobject

@JvmInline
value class Email private constructor(val value: String) {
    companion object {
        private val EMAIL_REGEX = Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")

        fun create(email: String): Email {
            require(email.isNotBlank() && EMAIL_REGEX.matches(email)) {
                "Invalid email format: $email"
            }
            return Email(email.lowercase())
        }

        fun fromExisting(email: String): Email = Email(email.lowercase())
    }

    fun equals(other: Email): Boolean = this.value == other.value
}
