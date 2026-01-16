package com.couplecalendar.common.security

import java.util.UUID

data class UserPrincipal(
    val id: UUID,
    val email: String
)
