package com.couplecalendar.presentation.controller

import com.couplecalendar.application.dto.request.ConnectCoupleRequest
import com.couplecalendar.application.dto.request.CreateCoupleRequest
import com.couplecalendar.application.dto.response.CoupleResponse
import com.couplecalendar.application.dto.response.InviteCodeResponse
import com.couplecalendar.application.service.CouplesService
import com.couplecalendar.common.security.CurrentUser
import com.couplecalendar.common.security.UserPrincipal
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/couples")
class CouplesController(
    private val couplesService: CouplesService
) {

    @PostMapping("/invite")
    fun createCouple(
        @CurrentUser user: UserPrincipal,
        @Valid @RequestBody request: CreateCoupleRequest
    ): InviteCodeResponse =
        couplesService.createInvite(user.id, request)

    @PostMapping("/connect")
    fun connectCouple(
        @CurrentUser user: UserPrincipal,
        @Valid @RequestBody request: ConnectCoupleRequest
    ): CoupleResponse =
        couplesService.connectWithPartner(user.id, request.inviteCode)

    @GetMapping("/{id}")
    fun getCouple(
        @CurrentUser user: UserPrincipal,
        @PathVariable id: UUID
    ): CoupleResponse =
        couplesService.getCouple(user.id, id)
}
