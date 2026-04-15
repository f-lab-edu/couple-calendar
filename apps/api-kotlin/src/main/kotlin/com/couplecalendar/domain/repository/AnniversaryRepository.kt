package com.couplecalendar.domain.repository

import com.couplecalendar.domain.aggregate.Anniversary
import java.util.UUID

interface AnniversaryRepository {
    fun findById(id: UUID): Anniversary?
    fun findByCoupleId(coupleId: UUID): List<Anniversary>
    fun save(anniversary: Anniversary)
    fun update(anniversary: Anniversary)
    fun delete(id: UUID)
}
