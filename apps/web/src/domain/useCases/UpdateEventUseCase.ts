import type Event from "../entities/Event";
import type { EventRepository, UpdateEventInput } from "../repositories/EventRepository";

/**
 * Partially update a shared calendar event.
 *
 * PATCH semantics: only the provided fields are validated and sent.
 * - A provided `title` must not be blank.
 * - When both `startTime` and `endTime` are provided, the range must be positive.
 */
export class UpdateEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(id: string, input: UpdateEventInput): Promise<Event> {
		if (!id.trim()) {
			throw new Error("수정할 일정을 찾을 수 없습니다.");
		}
		if (input.title !== undefined && !input.title.trim()) {
			throw new Error("일정 제목을 입력해주세요.");
		}
		if (
			input.startTime !== undefined &&
			input.endTime !== undefined &&
			Date.parse(input.endTime) <= Date.parse(input.startTime)
		) {
			throw new Error("종료 시간은 시작 시간보다 뒤여야 합니다.");
		}
		return this.eventRepository.updateEvent(id, input);
	}
}
