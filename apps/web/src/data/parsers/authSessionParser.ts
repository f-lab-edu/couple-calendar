import type { AuthResponse } from "@/data/dto/auth-response";
import AuthSession from "@/domain/entities/AuthSession";

export const parseAuthSession = (raw: AuthResponse): AuthSession =>
	new AuthSession(raw.accessToken, {
		id: raw.user.id,
		email: raw.user.email,
		nickname: raw.user.nickname,
	});
