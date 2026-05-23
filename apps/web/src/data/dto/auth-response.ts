export interface AuthUserInfo {
	id: string;
	email: string;
	nickname: string;
}

export interface AuthResponse {
	accessToken: string;
	user: AuthUserInfo;
}
