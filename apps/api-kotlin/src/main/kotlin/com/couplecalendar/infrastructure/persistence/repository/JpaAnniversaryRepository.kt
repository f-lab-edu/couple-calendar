package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.AnniversaryEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaAnniversaryRepository : JpaRepository<AnniversaryEntity, UUID> {
    fun findByCoupleIdOrderByDateAsc(coupleId: UUID): List<AnniversaryEntity>
}
