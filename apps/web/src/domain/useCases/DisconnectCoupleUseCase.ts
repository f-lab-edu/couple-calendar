import type { CoupleRepository } from "../repositories/CoupleRepository";

/**
 * 커플 연결을 해제한다.
 * 되돌릴 수 없는 동작이므로 호출 측(presentation)에서 사용자 확인을 받는다.
 */
export class DisconnectCoupleUseCase {
	constructor(private readonly coupleRepository: CoupleRepository) {}

	execute(): Promise<void> {
		return this.coupleRepository.disconnect();
	}
}
