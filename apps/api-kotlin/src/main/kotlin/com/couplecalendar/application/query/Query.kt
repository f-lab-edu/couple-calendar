package com.couplecalendar.application.query

interface Query<R>

interface QueryHandler<Q : Query<R>, R> {
    fun handle(query: Q): R
}
