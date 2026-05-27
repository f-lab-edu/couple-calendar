import type Event from "../entities/Event";
import type { EventRepository } from "../repositories/EventRepository";

export class GetMonthlyEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(year: number, month: number): Promise<Event[]> {
		return this.eventRepository.getMonthlyEvents(year, month);
	}
}
