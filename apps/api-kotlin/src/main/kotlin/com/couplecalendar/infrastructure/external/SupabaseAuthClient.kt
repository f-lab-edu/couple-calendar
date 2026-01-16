package com.couplecalendar.infrastructure.external

import com.couplecalendar.common.exception.UnauthorizedException
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatusCode
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono

@Component
class SupabaseAuthClient(
    @Value("\${supabase.url}") private val supabaseUrl: String,
    @Value("\${supabase.anon-key}") private val supabaseAnonKey: String
) {
    private val webClient: WebClient = WebClient.builder()
        .baseUrl(supabaseUrl)
        .defaultHeader("apikey", supabaseAnonKey)
        .defaultHeader("Content-Type", "application/json")
        .build()

    fun signInWithApple(identityToken: String): AuthResult {
        val response = webClient.post()
            .uri("/auth/v1/token?grant_type=id_token")
            .bodyValue(mapOf(
                "provider" to "apple",
                "id_token" to identityToken
            ))
            .retrieve()
            .onStatus(HttpStatusCode::isError) {
                Mono.error(UnauthorizedException("Apple authentication failed"))
            }
            .bodyToMono(SupabaseAuthResponse::class.java)
            .block() ?: throw UnauthorizedException("Apple authentication failed")

        return AuthResult(
            accessToken = response.access_token,
            email = response.user?.email
        )
    }

    fun verifyToken(token: String): TokenVerification {
        val response = webClient.get()
            .uri("/auth/v1/user")
            .header("Authorization", "Bearer $token")
            .retrieve()
            .onStatus(HttpStatusCode::isError) {
                Mono.error(UnauthorizedException("Invalid token"))
            }
            .bodyToMono(SupabaseUserResponse::class.java)
            .block() ?: throw UnauthorizedException("Invalid token")

        return TokenVerification(
            userId = response.id,
            email = response.email
        )
    }

    data class AuthResult(
        val accessToken: String,
        val email: String?
    )

    data class TokenVerification(
        val userId: String,
        val email: String?
    )
}

data class SupabaseAuthResponse(
    val access_token: String,
    val token_type: String? = null,
    val expires_in: Int? = null,
    val refresh_token: String? = null,
    val user: SupabaseUser? = null
)

data class SupabaseUser(
    val id: String,
    val email: String? = null,
    val app_metadata: Map<String, Any>? = null,
    val user_metadata: Map<String, Any>? = null
)

data class SupabaseUserResponse(
    val id: String,
    val email: String? = null,
    val app_metadata: Map<String, Any>? = null,
    val user_metadata: Map<String, Any>? = null
)
