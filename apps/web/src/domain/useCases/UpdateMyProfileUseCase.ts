import type User from "../entities/User";
import type { UpdateProfileInput, UserRepository } from "../repositories/UserRepository";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 내 프로필을 갱신한다.
 *
 * 전달된 필드만 검증·갱신한다(부분 갱신). 이름/닉네임은 빈 값 불가,
 * 생일은 형식 + 미래 금지 규칙을 도메인에서 강제한다.
 */
export class UpdateMyProfileUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(input: UpdateProfileInput): Promise<User> {
		const normalized: UpdateProfileInput = { ...input };

		if (normalized.name !== undefined) {
			normalized.name = normalized.name.trim();
			if (!normalized.name) throw new Error("이름을 입력해 주세요.");
		}

		if (normalized.nickname !== undefined) {
			normalized.nickname = normalized.nickname.trim();
			if (!normalized.nickname) throw new Error("닉네임을 입력해 주세요.");
		}

		if (normalized.birthday) {
			if (!DATE_PATTERN.test(normalized.birthday)) {
				throw new Error("생일을 올바르게 선택해 주세요.");
			}
			const picked = new Date(`${normalized.birthday}T00:00:00`);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (Number.isNaN(picked.getTime()) || picked.getTime() > today.getTime()) {
				throw new Error("생일은 오늘 이후로 정할 수 없어요.");
			}
		}

		if (normalized.bio !== undefined && normalized.bio !== null) {
			normalized.bio = normalized.bio.trim() || null;
		}

		if (normalized.partnerNickname !== undefined && normalized.partnerNickname !== null) {
			normalized.partnerNickname = normalized.partnerNickname.trim() || null;
		}

		return this.userRepository.updateMe(normalized);
	}
}
