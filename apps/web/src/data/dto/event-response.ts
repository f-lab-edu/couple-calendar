export type EventCategory = "DATE" | "ANNIVERSARY" | "INDIVIDUAL" | "OTHER";

export interface EventResponse {
	id: string;
	coupleId: string;
	title: string;
	startTime: string;
	endTime: string;
	category: EventCategory;
	authorId: string;
	description: string | null;
	location: string | null;
	createdAt: string;
	updatedAt: string;
}
