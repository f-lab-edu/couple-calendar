export interface AuthUserInfo {
	id: string;
	email: string;
	nickname: string;
}

export interface AuthResponse {
	accessToken: string;
	/** accessToken 만료 시 갱신에 쓰는 refresh token. 백엔드(Supabase)가 함께 내려준다. */
	refreshToken?: string;
	user: AuthUserInfo;
}
