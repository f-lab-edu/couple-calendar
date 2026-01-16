package com.couplecalendar.application.command

interface Command<R>

interface CommandHandler<C : Command<R>, R> {
    fun handle(command: C): R
}
