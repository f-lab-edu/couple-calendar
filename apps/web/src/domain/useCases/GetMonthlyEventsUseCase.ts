import type Event from "../entities/Event";
import type { EventRepository } from "../repositories/EventRepository";

/**
 * Fetch all events that fall within the given calendar month.
 * Month is 1-based (1 = January, 12 = December).
 */
export class GetMonthlyEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(year: number, month: number): Promise<Event[]> {
		return this.eventRepository.getMonthlyEvents(year, month);
	}
}
