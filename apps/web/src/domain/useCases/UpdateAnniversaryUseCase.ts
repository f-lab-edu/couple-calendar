import type Anniversary from "../entities/Anniversary";
import type {
	AnniversaryRepository,
	UpdateAnniversaryInput,
} from "../repositories/AnniversaryRepository";

/**
 * Partially update a custom anniversary.
 *
 * PATCH semantics: only the provided fields are validated and sent.
 * - A provided `title` must not be blank.
 * - A provided `date` must not be blank.
 *
 * AUTO anniversaries are read-only; the backend rejects them with 400. The
 * presentation layer hides the edit affordance for AUTO items, so this use case
 * only guards the field-level invariants.
 */
export class UpdateAnniversaryUseCase {
	constructor(private readonly anniversaryRepository: AnniversaryRepository) {}

	async execute(id: string, input: UpdateAnniversaryInput): Promise<Anniversary> {
		if (!id.trim()) {
			throw new Error("수정할 기념일을 찾을 수 없습니다.");
		}
		if (input.title !== undefined && !input.title.trim()) {
			throw new Error("기념일 제목을 입력해주세요.");
		}
		if (input.date !== undefined && !input.date.trim()) {
			throw new Error("기념일 날짜를 선택해주세요.");
		}
		return this.anniversaryRepository.updateAnniversary(id, input);
	}
}
