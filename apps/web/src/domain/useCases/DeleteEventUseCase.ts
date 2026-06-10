import type { EventRepository } from "../repositories/EventRepository";

/**
 * Delete a shared calendar event by id.
 * Guards against an empty id before delegating to the repository.
 */
export class DeleteEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(id: string): Promise<void> {
		if (!id.trim()) {
			throw new Error("삭제할 일정을 찾을 수 없습니다.");
		}
		return this.eventRepository.deleteEvent(id);
	}
}
