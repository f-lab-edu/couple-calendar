import type AuthSession from "../entities/AuthSession";
import type { AuthRepository } from "../repositories/AuthRepository";

/**
 * 이메일/비밀번호로 로그인한다(신규 이메일이면 가입 겸용).
 *
 * email/password는 필수이며 공백이면 도메인에서 거부한다(HTTP 호출 전 차단).
 */
export class SignInWithEmailUseCase {
	constructor(private readonly authRepository: AuthRepository) {}

	async execute(email: string, password: string): Promise<AuthSession> {
		const trimmedEmail = email.trim();
		if (!trimmedEmail) {
			throw new Error("이메일을 입력해 주세요.");
		}
		if (!password) {
			throw new Error("비밀번호를 입력해 주세요.");
		}

		return this.authRepository.signInWithEmail(trimmedEmail, password);
	}
}
