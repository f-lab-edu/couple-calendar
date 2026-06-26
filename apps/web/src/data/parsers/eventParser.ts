import type { EventCategory, EventResponse } from "@/data/dto/event-response";
import Event, { type EEventCategory } from "@/domain/entities/Event";

const VALID_CATEGORIES: readonly EventCategory[] = ["DATE", "ANNIVERSARY", "INDIVIDUAL", "OTHER"];

const parseCategory = (raw: EventCategory): EEventCategory => {
	if (!VALID_CATEGORIES.includes(raw)) {
		throw new Error(`Unknown event category from server: ${raw}`);
	}
	return raw;
};

/**
 * Convert a single EventResponse DTO into a domain Event entity.
 * Keeps the time strings in ISO 8601 form so consumers can normalize per locale.
 */
export const parseEvent = (raw: EventResponse): Event => {
	return new Event(
		raw.id,
		raw.coupleId,
		raw.title,
		raw.startTime,
		raw.endTime,
		parseCategory(raw.category),
		raw.authorId,
		raw.description,
		raw.location,
	);
};

export const parseEvents = (raws: EventResponse[]): Event[] => raws.map(parseEvent);
