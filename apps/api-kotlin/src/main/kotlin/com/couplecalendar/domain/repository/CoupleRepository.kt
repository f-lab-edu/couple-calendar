package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.Couple
import java.util.UUID

interface CoupleRepository {
    fun findById(id: UUID): Couple?
    fun findByUserId(userId: UUID): Couple?
    fun findByInviteCode(code: String): Couple?
    fun save(couple: Couple)
    fun update(couple: Couple)
    fun delete(id: UUID)
}
