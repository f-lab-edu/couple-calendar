import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";

/**
 * 커플의 기념일 목록을 조회한다.
 */
export class GetAnniversariesUseCase {
	constructor(private readonly anniversaryRepository: AnniversaryRepository) {}

	execute(): Promise<Anniversary[]> {
		return this.anniversaryRepository.getAnniversaries();
	}
}
