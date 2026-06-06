import type Event from "../entities/Event";
import type { EEventCategory } from "../entities/Event";

export interface CreateEventInput {
	title: string;
	startTime: string;
	endTime: string;
	category: EEventCategory;
	description: string | null;
	location: string | null;
}

/**
 * Repository contract for the Event aggregate.
 *
 * Domain layer interface — implementations live under `data/repositories/`
 * and inject concrete data sources. Month is 1-based (1 = January, 12 = December)
 * to keep the call-site human-readable.
 */
export interface EventRepository {
	getMonthlyEvents(year: number, month: number): Promise<Event[]>;
	createEvent(input: CreateEventInput): Promise<Event>;
}
