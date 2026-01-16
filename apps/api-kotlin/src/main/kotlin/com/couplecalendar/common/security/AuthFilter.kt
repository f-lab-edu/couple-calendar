package com.couplecalendar.common.security

import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.UUID

@Component
class AuthFilter(
    private val supabaseAuthClient: SupabaseAuthClient
) : OncePerRequestFilter() {

    private val publicPaths = listOf(
        "/api/auth/",
        "/api/health"
    )

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val path = request.requestURI

        if (publicPaths.any { path.startsWith(it) }) {
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader("Authorization")
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Missing authorization header")
            return
        }

        try {
            val token = authHeader.substring(7)
            val verification = supabaseAuthClient.verifyToken(token)

            request.setAttribute("currentUser", UserPrincipal(
                id = UUID.fromString(verification.userId),
                email = verification.email ?: ""
            ))

            filterChain.doFilter(request, response)
        } catch (e: Exception) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
        }
    }
}
