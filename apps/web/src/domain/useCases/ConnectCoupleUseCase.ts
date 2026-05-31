import type Couple from "../entities/Couple";
import type { CoupleRepository } from "../repositories/CoupleRepository";

const INVITE_CODE_PATTERN = /^[A-Z0-9]{6}$/;

export class ConnectCoupleUseCase {
	constructor(private readonly coupleRepository: CoupleRepository) {}

	async execute(inviteCode: string): Promise<Couple> {
		const normalized = inviteCode.trim().toUpperCase();
		if (!INVITE_CODE_PATTERN.test(normalized)) {
			throw new Error("초대 코드는 6자리 영문/숫자여야 합니다.");
		}
		return this.coupleRepository.connect(normalized);
	}
}
