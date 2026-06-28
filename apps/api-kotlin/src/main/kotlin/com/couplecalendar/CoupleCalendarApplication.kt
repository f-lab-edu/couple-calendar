package com.couplecalendar

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class CoupleCalendarApplication

fun main(args: Array<String>) {
    runApplication<CoupleCalendarApplication>(*args)
}
