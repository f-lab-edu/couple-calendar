import type Event from "../entities/Event";
import type { CreateEventInput, EventRepository } from "../repositories/EventRepository";

/**
 * Create a shared calendar event.
 * Validates required title and a positive time range before delegating.
 */
export class CreateEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(input: CreateEventInput): Promise<Event> {
		if (!input.title.trim()) {
			throw new Error("일정 제목을 입력해주세요.");
		}
		if (Date.parse(input.endTime) <= Date.parse(input.startTime)) {
			throw new Error("종료 시간은 시작 시간보다 뒤여야 합니다.");
		}
		return this.eventRepository.createEvent(input);
	}
}
