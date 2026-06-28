export type EEventCategory = "DATE" | "ANNIVERSARY" | "INDIVIDUAL" | "OTHER";

/**
 * Event domain entity.
 *
 * Pure TypeScript model — no framework, no HTTP, no React.
 * Times are kept as ISO 8601 strings for transport/serialization parity.
 */
class Event {
	readonly id: string;
	readonly coupleId: string;
	readonly title: string;
	readonly startTime: string;
	readonly endTime: string;
	readonly category: EEventCategory;
	/** 작성자(커플 구성원) id. 일정 배지를 작성자별로 구분하는 데 쓴다. */
	readonly authorId: string;
	readonly description: string | null;
	readonly location: string | null;

	constructor(
		id: string,
		coupleId: string,
		title: string,
		startTime: string,
		endTime: string,
		category: EEventCategory,
		authorId: string,
		description: string | null,
		location: string | null,
	) {
		this.id = id;
		this.coupleId = coupleId;
		this.title = title;
		this.startTime = startTime;
		this.endTime = endTime;
		this.category = category;
		this.authorId = authorId;
		this.description = description;
		this.location = location;
	}
}

export default Event;
