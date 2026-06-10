package com.couplecalendar.application.command.user

import com.couplecalendar.application.command.Command
import com.couplecalendar.application.command.CommandHandler
import com.couplecalendar.common.exception.BadRequestException
import com.couplecalendar.common.exception.NotFoundException
import com.couplecalendar.domain.aggregate.User
import com.couplecalendar.domain.repository.UserRepository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.UUID

data class UpdateUserCommand(
    val userId: UUID,
    val name: String? = null,
    val nickname: String? = null,
    val birthday: String? = null,
    val birthdayPresent: Boolean = false,
    val bio: String? = null,
    val bioPresent: Boolean = false,
    val partnerNickname: String? = null,
    val partnerNicknamePresent: Boolean = false
) : Command<User>

@Component
class UpdateUserCommandHandler(
    private val userRepository: UserRepository
) : CommandHandler<UpdateUserCommand, User> {

    @Transactional
    override fun handle(command: UpdateUserCommand): User {
        val user = userRepository.findById(command.userId)
            ?: throw NotFoundException("User not found")

        val birthday: LocalDate? = if (command.birthdayPresent && command.birthday != null) {
            try {
                LocalDate.parse(command.birthday)
            } catch (e: DateTimeParseException) {
                throw BadRequestException("Invalid birthday format. Expected YYYY-MM-DD")
            }
        } else {
            null
        }

        try {
            user.updateProfile(
                name = command.name,
                nickname = command.nickname,
                birthday = birthday,
                birthdayPresent = command.birthdayPresent,
                bio = command.bio,
                bioPresent = command.bioPresent,
                partnerNickname = command.partnerNickname,
                partnerNicknamePresent = command.partnerNicknamePresent
            )
        } catch (e: IllegalArgumentException) {
            throw BadRequestException(e.message ?: "Invalid user profile update")
        }

        userRepository.update(user)
        return user
    }
}
