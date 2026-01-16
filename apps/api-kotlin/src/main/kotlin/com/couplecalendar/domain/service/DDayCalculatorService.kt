package com.couplecalendar.domain.service

import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class DDayCalculatorService {

    fun calculateDaysFromStart(startDate: LocalDate, referenceDate: LocalDate = LocalDate.now()): Long =
        ChronoUnit.DAYS.between(startDate, referenceDate)

    fun calculateDaysUntil(targetDate: LocalDate, referenceDate: LocalDate = LocalDate.now()): Long =
        ChronoUnit.DAYS.between(referenceDate, targetDate)

    fun getNextAnniversary(startDate: LocalDate, referenceDate: LocalDate = LocalDate.now()): LocalDate {
        var anniversary = startDate.withYear(referenceDate.year)
        if (anniversary.isBefore(referenceDate) || anniversary == referenceDate) {
            anniversary = anniversary.plusYears(1)
        }
        return anniversary
    }

    fun getAnniversaryNumber(startDate: LocalDate, referenceDate: LocalDate = LocalDate.now()): Int =
        referenceDate.year - startDate.year

    fun getUpcomingMilestones(
        startDate: LocalDate,
        referenceDate: LocalDate = LocalDate.now(),
        count: Int = 3
    ): List<Milestone> {
        val daysFromStart = calculateDaysFromStart(startDate, referenceDate)
        val intervals = listOf(100L, 200L, 300L, 365L, 500L, 730L, 1000L, 1095L, 1461L)

        return intervals
            .filter { it > daysFromStart }
            .take(count)
            .map { days ->
                Milestone(
                    days = days,
                    date = startDate.plusDays(days)
                )
            }
    }

    data class Milestone(val days: Long, val date: LocalDate)
}
