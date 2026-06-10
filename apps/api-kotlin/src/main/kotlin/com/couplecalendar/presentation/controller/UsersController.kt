package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.UpdateUserRequest
import com.couplecalendar.application.dto.response.UserResponse
import com.couplecalendar.application.service.UsersService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/users")
class UsersController(
    private val usersService: UsersService
) {

    @GetMapping("/me")
    fun getCurrentUser(@CurrentUser user: UserPrincipal): UserResponse =
        usersService.getCurrentUser(user.id)

    @PatchMapping("/me")
    fun updateCurrentUser(
        @CurrentUser user: UserPrincipal,
        @RequestBody request: UpdateUserRequest
    ): UserResponse =
        usersService.updateCurrentUser(user.id, request)

    @GetMapping("/{id}")
    fun getUserById(
        @CurrentUser user: UserPrincipal,
        @PathVariable id: UUID
    ): UserResponse =
        usersService.getUserByIdFor(user.id, id)
}
