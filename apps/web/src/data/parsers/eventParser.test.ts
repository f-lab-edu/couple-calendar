import { describe, expect, it } from "vitest";
import type { EventResponse } from "@/data/dto/event-response";
import { parseEvent, parseEvents } from "./eventParser";

const dto = (overrides: Partial<EventResponse> = {}): EventResponse => ({
	id: "evt-1",
	coupleId: "couple-1",
	title: "데이트",
	startTime: "2026-06-06T10:00:00.000Z",
	endTime: "2026-06-06T12:00:00.000Z",
	category: "DATE",
	authorId: "user-1",
	description: "홍대",
	location: "홍대입구역",
	createdAt: "2026-06-01T00:00:00.000Z",
	updatedAt: "2026-06-01T00:00:00.000Z",
	...overrides,
});

describe("parseEvent", () => {
	it("DTO를 도메인 Event로 매핑한다", () => {
		const event = parseEvent(dto());
		expect(event).toMatchObject({
			id: "evt-1",
			coupleId: "couple-1",
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE",
			description: "홍대",
			location: "홍대입구역",
		});
	});

	it("description/location의 null을 보존한다", () => {
		const event = parseEvent(dto({ description: null, location: null }));
		expect(event.description).toBeNull();
		expect(event.location).toBeNull();
	});

	it.each(["DATE", "ANNIVERSARY", "INDIVIDUAL", "OTHER"] as const)(
		"허용 카테고리 %s를 통과시킨다",
		(category) => {
			expect(parseEvent(dto({ category })).category).toBe(category);
		},
	);

	it("허용되지 않은 카테고리면 에러를 던진다", () => {
		expect(() => parseEvent(dto({ category: "UNKNOWN" as never }))).toThrow(
			"Unknown event category from server: UNKNOWN",
		);
	});
});

describe("parseEvents", () => {
	it("배열을 순서대로 매핑한다", () => {
		const events = parseEvents([dto({ id: "a" }), dto({ id: "b" })]);
		expect(events.map((e) => e.id)).toEqual(["a", "b"]);
	});

	it("빈 배열이면 빈 배열을 반환한다", () => {
		expect(parseEvents([])).toEqual([]);
	});
});
