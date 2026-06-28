import type Event from "../entities/Event";
import type { EventRepository } from "../repositories/EventRepository";

/** 커플의 전체 일정을 가져온다(검색 등 전 기간 조회용). */
export class GetAllEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(): Promise<Event[]> {
		return this.eventRepository.getAllEvents();
	}
}
