import { EventDataSource } from "@/data/apis/EventDataSource";
import { parseEvent, parseEvents } from "@/data/parsers/eventParser";
import type Event from "@/domain/entities/Event";
import type {
	CreateEventInput,
	EventRepository,
	UpdateEventInput,
} from "@/domain/repositories/EventRepository";

const KST_OFFSET = "+09:00";

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Build an ISO 8601 timestamp at KST (+09:00) without relying on the host
 * machine's timezone. The home calendar reasons in Korean local days, so we
 * anchor the boundaries to KST regardless of where the browser runs.
 */
const buildKstIso = (
	year: number,
	month1Based: number,
	day: number,
	hour: number,
	minute: number,
	second: number,
): string => {
	return `${year}-${pad2(month1Based)}-${pad2(day)}T${pad2(hour)}:${pad2(minute)}:${pad2(second)}${KST_OFFSET}`;
};

const lastDayOfMonth = (year: number, month1Based: number): number => {
	// new Date(year, month1Based, 0) gives the last day of month1Based because
	// the month argument is 0-based and day 0 rolls back to previous month.
	return new Date(year, month1Based, 0).getDate();
};

/**
 * EventRepository implementation backed by the remote HTTP datasource.
 *
 * Computes a KST-anchored [startDate, endDate] window for the requested
 * calendar month, then maps the resulting DTOs into domain entities.
 */
export class EventRepositoryImpl implements EventRepository {
	constructor(private readonly dataSource: EventDataSource = new EventDataSource()) {}

	async getMonthlyEvents(year: number, month: number): Promise<Event[]> {
		if (month < 1 || month > 12) {
			throw new Error(`month must be 1..12, got ${month}`);
		}

		const lastDay = lastDayOfMonth(year, month);
		const startIso = buildKstIso(year, month, 1, 0, 0, 0);
		const endIso = buildKstIso(year, month, lastDay, 23, 59, 59);

		const dtos = await this.dataSource.getEvents(startIso, endIso);
		return parseEvents(dtos);
	}

	async getAllEvents(): Promise<Event[]> {
		const dtos = await this.dataSource.getEvents();
		return parseEvents(dtos);
	}

	async createEvent(input: CreateEventInput): Promise<Event> {
		const created = await this.dataSource.createEvent({
			title: input.title,
			startTime: input.startTime,
			endTime: input.endTime,
			category: input.category,
			description: input.description,
			location: input.location,
		});
		return parseEvent(created);
	}

	async updateEvent(id: string, input: UpdateEventInput): Promise<Event> {
		const updated = await this.dataSource.updateEvent(id, {
			title: input.title,
			startTime: input.startTime,
			endTime: input.endTime,
			category: input.category,
			description: input.description,
			location: input.location,
		});
		return parseEvent(updated);
	}

	async deleteEvent(id: string): Promise<void> {
		await this.dataSource.deleteEvent(id);
	}
}
