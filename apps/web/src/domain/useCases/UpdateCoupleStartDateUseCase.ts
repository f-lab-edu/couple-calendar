import type Couple from "../entities/Couple";
import type { CoupleRepository } from "../repositories/CoupleRepository";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 커플 시작일을 수정한다.
 * 형식 검증 + 미래 금지 규칙을 도메인에서 강제한다.
 */
export class UpdateCoupleStartDateUseCase {
	constructor(private readonly coupleRepository: CoupleRepository) {}

	async execute(startDate: string): Promise<Couple> {
		const normalized = startDate.trim();

		if (!DATE_PATTERN.test(normalized)) {
			throw new Error("시작일을 올바르게 선택해 주세요.");
		}

		const picked = new Date(`${normalized}T00:00:00`);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		if (Number.isNaN(picked.getTime()) || picked.getTime() > today.getTime()) {
			throw new Error("시작일은 오늘 이후로 정할 수 없어요.");
		}

		return this.coupleRepository.updateStartDate(normalized);
	}
}
