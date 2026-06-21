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
            accessToken = response.access_token ?: throw UnauthorizedException("Apple authentication failed"),
            email = response.user?.email,
            refreshToken = response.refresh_token
        )
    }

    /**
     * 이메일/비밀번호 로그인. 자격 증명이 틀리면 UnauthorizedException.
     */
    fun signInWithPassword(email: String, password: String): AuthResult {
        val response = webClient.post()
            .uri("/auth/v1/token?grant_type=password")
            .bodyValue(mapOf("email" to email, "password" to password))
            .retrieve()
            .onStatus(HttpStatusCode::isError) {
                Mono.error(UnauthorizedException("Email login failed"))
            }
            .bodyToMono(SupabaseAuthResponse::class.java)
            .block() ?: throw UnauthorizedException("Email login failed")

        return AuthResult(
            accessToken = response.access_token ?: throw UnauthorizedException("Email login failed"),
            email = response.user?.email,
            refreshToken = response.refresh_token
        )
    }

    /**
     * 이메일/비밀번호 회원가입.
     * ⚠️ Supabase Auth 의 "Confirm email" 이 꺼져 있어야 가입 즉시 access_token 이 반환된다.
     * 켜져 있으면 access_token 이 없어 역직렬화 실패(가입은 되나 세션 미발급).
     */
    fun signUpWithEmail(email: String, password: String): AuthResult {
        val response = webClient.post()
            .uri("/auth/v1/signup")
            .bodyValue(mapOf("email" to email, "password" to password))
            .retrieve()
            .onStatus(HttpStatusCode::isError) {
                Mono.error(UnauthorizedException("Email signup failed"))
            }
            .bodyToMono(SupabaseAuthResponse::class.java)
            .block() ?: throw UnauthorizedException("Email signup failed")

        val accessToken = response.access_token
            ?: throw UnauthorizedException(
                "회원가입은 됐지만 세션이 발급되지 않았습니다. Supabase Auth에서 'Confirm email'을 꺼주세요."
            )
        return AuthResult(accessToken = accessToken, email = response.user?.email, refreshToken = response.refresh_token)
    }

    /**
     * refresh token으로 새 access/refresh token 쌍을 발급받는다(accessToken 만료 시 자동 갱신용).
     * Supabase는 refresh token을 회전시키므로 응답의 새 refresh_token을 반드시 저장해야 한다.
     */
    fun refreshSession(refreshToken: String): AuthResult {
        val response = webClient.post()
            .uri("/auth/v1/token?grant_type=refresh_token")
            .bodyValue(mapOf("refresh_token" to refreshToken))
            .retrieve()
            .onStatus(HttpStatusCode::isError) {
                Mono.error(UnauthorizedException("Token refresh failed"))
            }
            .bodyToMono(SupabaseAuthResponse::class.java)
            .block() ?: throw UnauthorizedException("Token refresh failed")

        return AuthResult(
            accessToken = response.access_token ?: throw UnauthorizedException("Token refresh failed"),
            email = response.user?.email,
            refreshToken = response.refresh_token
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
        val email: String?,
        val refreshToken: String? = null
    )

    data class TokenVerification(
        val userId: String,
        val email: String?
    )
}

data class SupabaseAuthResponse(
    val access_token: String? = null,
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
