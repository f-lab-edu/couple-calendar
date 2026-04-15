package com.couplecalendar.application.dto.response

import com.couplecalendar.domain.aggregate.Anniversary
import java.time.LocalDate
import java.time.temporal.ChronoUnit

data class AnniversaryResponse(
    val id: String,
    val coupleId: String,
    val title: String,
    val date: String,
    val isRecurring: Boolean,
    val description: String?,
    val type: String,
    val daysUntil: Int
) {
    companion object {
        fun fromCustomAggregate(
            anniversary: Anniversary,
            referenceDate: LocalDate = LocalDate.now()
        ): AnniversaryResponse {
            val effectiveDate = if (anniversary.isRecurring) {
                nextRecurrence(anniversary.date, referenceDate)
            } else {
                anniversary.date
            }
            val days = ChronoUnit.DAYS.between(referenceDate, effectiveDate).toInt()
            return AnniversaryResponse(
                id = anniversary.id.toString(),
                coupleId = anniversary.coupleId.toString(),
                title = anniversary.title,
                date = effectiveDate.toString(),
                isRecurring = anniversary.isRecurring,
                description = anniversary.description,
                type = "CUSTOM",
                daysUntil = days
            )
        }

        fun fromAuto(
            coupleId: String,
            id: String,
            title: String,
            date: LocalDate,
            referenceDate: LocalDate = LocalDate.now()
        ): AnniversaryResponse = AnniversaryResponse(
            id = id,
            coupleId = coupleId,
            title = title,
            date = date.toString(),
            isRecurring = false,
            description = null,
            type = "AUTO",
            daysUntil = ChronoUnit.DAYS.between(referenceDate, date).toInt()
        )

        private fun nextRecurrence(baseDate: LocalDate, ref: LocalDate): LocalDate {
            var candidate = try {
                baseDate.withYear(ref.year)
            } catch (e: Exception) {
                baseDate
            }
            if (candidate.isBefore(ref)) {
                candidate = try {
                    baseDate.withYear(ref.year + 1)
                } catch (e: Exception) {
                    baseDate
                }
            }
            return candidate
        }
    }
}
