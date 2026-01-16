package com.couplecalendar.domain.aggregate

import java.time.Instant
import java.util.UUID

enum class EventCategory {
    DATE,
    ANNIVERSARY,
    INDIVIDUAL,
    OTHER
}

class Event private constructor(
    val id: UUID,
    val coupleId: UUID,
    private var _title: String,
    private var _startTime: Instant,
    private var _endTime: Instant,
    private var _category: EventCategory,
    val authorId: UUID,
    private var _description: String?,
    private var _location: String?,
    val createdAt: Instant,
    private var _updatedAt: Instant
) {
    val title: String get() = _title
    val startTime: Instant get() = _startTime
    val endTime: Instant get() = _endTime
    val category: EventCategory get() = _category
    val description: String? get() = _description
    val location: String? get() = _location
    val updatedAt: Instant get() = _updatedAt

    fun update(
        title: String? = null,
        startTime: Instant? = null,
        endTime: Instant? = null,
        category: EventCategory? = null,
        description: String? = null,
        location: String? = null
    ) {
        title?.let { _title = it }
        startTime?.let { _startTime = it }
        endTime?.let { _endTime = it }
        category?.let { _category = it }
        description?.let { _description = it }
        location?.let { _location = it }

        require(_endTime > _startTime) { "End time must be after start time" }
        _updatedAt = Instant.now()
    }

    fun belongsToCouple(coupleId: UUID): Boolean = this.coupleId == coupleId

    fun isAuthor(userId: UUID): Boolean = this.authorId == userId

    companion object {
        fun create(
            coupleId: UUID,
            title: String,
            startTime: Instant,
            endTime: Instant,
            category: EventCategory,
            authorId: UUID,
            description: String? = null,
            location: String? = null
        ): Event {
            require(title.isNotBlank()) { "Title cannot be blank" }
            require(endTime > startTime) { "End time must be after start time" }

            val now = Instant.now()
            return Event(
                id = UUID.randomUUID(),
                coupleId = coupleId,
                _title = title,
                _startTime = startTime,
                _endTime = endTime,
                _category = category,
                authorId = authorId,
                _description = description,
                _location = location,
                createdAt = now,
                _updatedAt = now
            )
        }

        fun reconstitute(
            id: UUID,
            coupleId: UUID,
            title: String,
            startTime: Instant,
            endTime: Instant,
            category: EventCategory,
            authorId: UUID,
            description: String?,
            location: String?,
            createdAt: Instant,
            updatedAt: Instant
        ): Event = Event(
            id = id,
            coupleId = coupleId,
            _title = title,
            _startTime = startTime,
            _endTime = endTime,
            _category = category,
            authorId = authorId,
            _description = description,
            _location = location,
            createdAt = createdAt,
            _updatedAt = updatedAt
        )
    }
}
