package com.couplecalendar.application.command.couple

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.domain.aggregate.Couple
import com.couplecalendar.domain.repository.CoupleRepository
import com.couplecalendar.domain.repository.UserRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.util.UUID

data class CreateCoupleCommand(
    val userId: UUID,
    val startDate: LocalDate
) : Command<Couple>

@Component
class CreateCoupleCommandHandler(
    private val coupleRepository: CoupleRepository,
    private val userRepository: UserRepository
) : CommandHandler<CreateCoupleCommand, Couple> {

    @Transactional
    override fun handle(command: CreateCoupleCommand): Couple {
        val user = userRepository.findById(command.userId)
            ?: throw BadRequestException("User not found")

        if (user.isInCouple()) {
            // 이미 커플이 있으면 새로 만들지 않는다.
            //   - 파트너 연결 완료된 커플 → 재초대 불가(에러)
            //   - 파트너 대기 중인 커플 → 초대 코드 재발급(만료/유효 무관) + 시작일 갱신
            val existing = coupleRepository.findByUserId(command.userId)
                ?: throw BadRequestException("User is already in a couple")
            if (existing.isComplete()) {
                throw BadRequestException("Couple is already complete")
            }
            existing.updateStartDate(command.startDate)
            existing.regenerateInviteCode()
            coupleRepository.update(existing)
            return existing
        }

        val couple = Couple.create(command.userId, command.startDate)
        coupleRepository.save(couple)

        user.joinCouple(couple.id)
        userRepository.update(user)

        return couple
    }
}
