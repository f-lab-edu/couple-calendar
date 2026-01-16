package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.response.UserResponse
import com.couplecalendar.application.service.UsersService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UsersController(
    private val usersService: UsersService
) {

    @GetMapping("/me")
    fun getCurrentUser(@CurrentUser user: UserPrincipal): UserResponse =
        usersService.getCurrentUser(user.id)
}
