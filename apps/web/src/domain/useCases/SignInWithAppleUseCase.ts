import type AuthSession from "../entities/AuthSession";
import type { AuthRepository } from "../repositories/AuthRepository";

/**
 * Apple identityToken으로 로그인한다.
 *
 * identityToken은 필수이며 공백이면 도메인에서 거부한다(HTTP 호출 전 차단).
 * authorizationCode는 선택값으로, 공백이면 전달하지 않는다.
 */
export class SignInWithAppleUseCase {
	constructor(private readonly authRepository: AuthRepository) {}

	async execute(identityToken: string, authorizationCode?: string): Promise<AuthSession> {
		const token = identityToken.trim();
		if (!token) {
			throw new Error("Apple 로그인 토큰이 필요합니다.");
		}

		const code = authorizationCode?.trim();
		return this.authRepository.signInWithApple(token, code || undefined);
	}
}
