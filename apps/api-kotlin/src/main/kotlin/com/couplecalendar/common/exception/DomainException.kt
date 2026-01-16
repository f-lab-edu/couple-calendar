package com.couplecalendar.common.exception

sealed class DomainException(
    override val message: String,
    val errorCode: ErrorCode
) : RuntimeException(message)

class BadRequestException(message: String) : DomainException(message, ErrorCode.BAD_REQUEST)
class NotFoundException(message: String) : DomainException(message, ErrorCode.NOT_FOUND)
class UnauthorizedException(message: String) : DomainException(message, ErrorCode.UNAUTHORIZED)
class ForbiddenException(message: String) : DomainException(message, ErrorCode.FORBIDDEN)

enum class ErrorCode(val status: Int) {
    BAD_REQUEST(400),
    UNAUTHORIZED(401),
    FORBIDDEN(403),
    NOT_FOUND(404),
    INTERNAL_ERROR(500)
}

data class ErrorResponse(
    val code: String,
    val message: String
)
