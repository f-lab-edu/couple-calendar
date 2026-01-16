package com.couplecalendar.domain.service

import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.UserRepository
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class CoupleMatchingService(
    private val userRepository: UserRepository,
    private val coupleRepository: CoupleRepository
) {

    fun validateCanCreateCouple(userId: UUID): User {
        val user = userRepository.findById(userId)
            ?: throw NotFoundException("User not found")

        if (user.isInCouple()) {
            throw BadRequestException("User is already in a couple")
        }

        return user
    }

    fun validateCanConnect(userId: UUID, inviteCode: String): ConnectionValidation {
        val user = userRepository.findById(userId)
            ?: throw NotFoundException("User not found")

        if (user.isInCouple()) {
            throw BadRequestException("User is already in a couple")
        }

        val couple = coupleRepository.findByInviteCode(inviteCode)
            ?: throw NotFoundException("Invalid invite code")

        if (!couple.isInviteCodeValid()) {
            throw BadRequestException("Invite code has expired")
        }

        if (couple.isComplete()) {
            throw BadRequestException("Couple is already complete")
        }

        if (couple.user1Id == userId) {
            throw BadRequestException("Cannot connect with yourself")
        }

        return ConnectionValidation(user, couple)
    }

    fun executeConnection(user: User, couple: Couple): Couple {
        couple.connectPartner(user.id)
        coupleRepository.update(couple)

        user.joinCouple(couple.id)
        userRepository.update(user)

        return couple
    }

    data class ConnectionValidation(
        val user: User,
        val couple: Couple
    )
}
