import type Couple from "../entities/Couple";
import type User from "../entities/User";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import type { UserRepository } from "../repositories/UserRepository";

/**
 * 설정 화면이 필요로 하는 커플 프로필 묶음.
 * 나/파트너/커플을 한 번에 제공한다.
 */
export interface CoupleProfile {
	me: User;
	partner: User | null;
	couple: Couple;
}

/**
 * 나 + 내 커플 + 파트너를 조합해 설정 화면용 프로필을 만든다.
 *
 * 파트너 식별("커플의 두 user 중 내가 아닌 쪽")은 도메인 규칙이므로
 * presentation이 아니라 이 UseCase에서 처리한다.
 */
export class GetCoupleProfileUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly coupleRepository: CoupleRepository,
	) {}

	async execute(): Promise<CoupleProfile> {
		const [me, couple] = await Promise.all([
			this.userRepository.getMe(),
			this.coupleRepository.getMyCouple(),
		]);

		const partnerId = couple.user1Id === me.id ? couple.user2Id : couple.user1Id;
		const partner = partnerId ? await this.userRepository.getById(partnerId) : null;

		return { me, partner, couple };
	}
}
