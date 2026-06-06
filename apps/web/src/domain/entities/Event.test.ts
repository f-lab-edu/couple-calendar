import { describe, expect, it } from "vitest";
import Event from "./Event";

describe("Event", () => {
	it("생성자 인자를 모든 필드에 순서대로 할당한다", () => {
		const event = new Event(
			"evt-1",
			"couple-1",
			"데이트",
			"2026-06-06T10:00:00.000Z",
			"2026-06-06T12:00:00.000Z",
			"DATE",
			"홍대에서",
			"홍대입구역",
		);

		expect(event).toMatchObject({
			id: "evt-1",
			coupleId: "couple-1",
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE",
			description: "홍대에서",
			location: "홍대입구역",
		});
	});

	it("description/location은 null을 허용한다", () => {
		const event = new Event(
			"evt-2",
			"couple-1",
			"기념일",
			"2026-06-06T00:00:00.000Z",
			"2026-06-07T00:00:00.000Z",
			"ANNIVERSARY",
			null,
			null,
		);

		expect(event.description).toBeNull();
		expect(event.location).toBeNull();
	});
});
