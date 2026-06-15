import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";

/**
 * Create a custom anniversary.
 * Validates a required title before delegating to the repository, then
 * returns the persisted entity (with its server-assigned id/daysUntil).
 */
export class AddAnniversaryUseCase {
	constructor(private readonly anniversaryRepository: AnniversaryRepository) {}

	async execute(anniversary: Anniversary): Promise<Anniversary> {
		if (!anniversary.title.trim()) {
			throw new Error("기념일 제목을 입력해주세요.");
		}
		if (!anniversary.date.trim()) {
			throw new Error("기념일 날짜를 선택해주세요.");
		}
		return this.anniversaryRepository.addAnniversary(anniversary);
	}
}
