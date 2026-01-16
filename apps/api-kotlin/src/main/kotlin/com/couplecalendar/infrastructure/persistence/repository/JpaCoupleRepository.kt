package com.couplecalendar.infrastructure.persistence.repository

import com.couplecalendar.infrastructure.persistence.entity.CoupleEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface JpaCoupleRepository : JpaRepository<CoupleEntity, UUID> {
    fun findByInviteCode(inviteCode: String): CoupleEntity?

    @Query("SELECT c FROM CoupleEntity c WHERE c.user1Id = :userId OR c.user2Id = :userId")
    fun findByUserId(userId: UUID): CoupleEntity?
}
