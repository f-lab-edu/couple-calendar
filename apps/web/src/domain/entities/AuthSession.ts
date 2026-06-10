/**
 * AuthSession domain entity.
 *
 * Apple 로그인 성공 결과를 표현하는 순수 TypeScript 모델.
 * 프레임워크/HTTP/React 무의존. accessToken과 인증된 사용자 식별 정보를 담는다.
 */
export interface AuthSessionUser {
	readonly id: string;
	readonly email: string;
	readonly nickname: string;
}

class AuthSession {
	readonly accessToken: string;
	readonly user: AuthSessionUser;

	constructor(accessToken: string, user: AuthSessionUser) {
		this.accessToken = accessToken;
		this.user = user;
	}
}

export default AuthSession;
