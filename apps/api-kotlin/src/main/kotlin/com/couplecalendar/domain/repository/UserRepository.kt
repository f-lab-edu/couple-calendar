package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.User
import java.util.UUID

interface UserRepository {
    fun findById(id: UUID): User?
    fun findByEmail(email: String): User?
    fun save(user: User)
    fun update(user: User)
    fun delete(id: UUID)
}
