package com.couplecalendar.domain.aggregate

import java.time.Instant
import java.time.LocalDate
import java.util.UUID

class Anniversary private constructor(
    val id: UUID,
    val coupleId: UUID,
    private var _title: String,
    private var _date: LocalDate,
    private var _isRecurring: Boolean,
    private var _description: String?,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val title: String get() = _title
    val date: LocalDate get() = _date
    val isRecurring: Boolean get() = _isRecurring
    val description: String? get() = _description
    val updatedAt: Instant get() = _updatedAt

    fun update(
        title: String? = null,
        date: LocalDate? = null,
        isRecurring: Boolean? = null,
        description: String? = null
    ) {
        title?.let {
            require(it.isNotBlank()) { "Title cannot be blank" }
            require(it.length in 1..50) { "Title must be 1 to 50 characters" }
            _title = it
        }
        date?.let { _date = it }
        isRecurring?.let { _isRecurring = it }
        description?.let {
            require(it.length <= 200) { "Description must not exceed 200 characters" }
            _description = it
        }
        _updatedAt = Instant.now()
    }

    fun belongsToCouple(coupleId: UUID): Boolean = this.coupleId == coupleId

    companion object {
        fun create(
            coupleId: UUID,
            title: String,
            date: LocalDate,
            isRecurring: Boolean,
            description: String? = null
        ): Anniversary {
            require(title.isNotBlank()) { "Title cannot be blank" }
            require(title.length in 1..50) { "Title must be 1 to 50 characters" }
            description?.let {
                require(it.length <= 200) { "Description must not exceed 200 characters" }
            }

            val now = Instant.now()
            return Anniversary(
                id = UUID.randomUUID(),
                coupleId = coupleId,
                _title = title,
                _date = date,
                _isRecurring = isRecurring,
                _description = description,
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            id: UUID,
            coupleId: UUID,
            title: String,
            date: LocalDate,
            isRecurring: Boolean,
            description: String?,
            createdAt: Instant,
            updatedAt: Instant
        ): Anniversary = Anniversary(
            id = id,
            coupleId = coupleId,
            _title = title,
            _date = date,
            _isRecurring = isRecurring,
            _description = description,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
