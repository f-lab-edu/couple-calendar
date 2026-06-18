import type AuthSession from "../entities/AuthSession";

export interface AuthRepository {
	/**
	 * Apple identityToken(+선택적 authorizationCode)으로 로그인하고
	 * 인증 세션(accessToken + user)을 반환한다.
	 */
	signInWithApple(identityToken: string, authorizationCode?: string): Promise<AuthSession>;

	/**
	 * 이메일/비밀번호로 로그인(또는 신규 시 가입)하고 인증 세션을 반환한다.
	 */
	signInWithEmail(email: string, password: string): Promise<AuthSession>;
}
