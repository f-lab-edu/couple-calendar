package com.couplecalendar.common.security

import com.couplecalendar.infrastructure.external.SupabaseAuthClient
import com.couplecalendar.infrastructure.persistence.repository.JpaUserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class AuthFilter(
    private val supabaseAuthClient: SupabaseAuthClient,
    private val jpaUserRepository: JpaUserRepository
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

            val email = verification.email
                ?: run {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Email not found in token")
                    return
                }

            val userEntity = jpaUserRepository.findByEmail(email.lowercase())
                ?: run {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found")
                    return
                }

            request.setAttribute("currentUser", UserPrincipal(
                id = userEntity.id,
                email = userEntity.email
            ))

            filterChain.doFilter(request, response)
        } catch (e: Exception) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
        }
    }
}
