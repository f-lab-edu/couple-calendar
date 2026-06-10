import type { EventCategory } from "./event-response";

export interface CreateEventRequest {
	title: string;
	startTime: string;
	endTime: string;
	category: EventCategory;
	description?: string | null;
	location?: string | null;
}

/**
 * Partial update payload for `PATCH /api/events/{id}`.
 * Every field is optional — only the provided fields are changed server-side.
 */
export type UpdateEventRequest = Partial<CreateEventRequest>;
