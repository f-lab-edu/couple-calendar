import type InviteCode from "../entities/InviteCode";
import type { CoupleRepository } from "../repositories/CoupleRepository";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 커플 시작일을 정해 초대 코드를 발급한다.
 *
 * 시작일은 코드를 "생성"하는 쪽(먼저 시작하는 사람)이 정하며,
 * 코드를 입력해 합류하는 쪽은 이 값을 그대로 상속받는다.
 */
export class GenerateInviteCodeUseCase {
	constructor(private readonly coupleRepository: CoupleRepository) {}

	async execute(startDate: string): Promise<InviteCode> {
		const normalized = startDate.trim();

		if (!DATE_PATTERN.test(normalized)) {
			throw new Error("시작일을 올바르게 선택해 주세요.");
		}

		const picked = new Date(`${normalized}T00:00:00`);
		if (Number.isNaN(picked.getTime())) {
			throw new Error("시작일을 올바르게 선택해 주세요.");
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (picked.getTime() > today.getTime()) {
			throw new Error("시작일은 오늘 이후로 정할 수 없어요.");
		}

		return this.coupleRepository.invite(normalized);
	}
}
