import { describe, expect, it, vi } from "vitest";
import type { EventDataSource } from "@/data/apis/EventDataSource";
import type { EventResponse } from "@/data/dto/event-response";
import type { CreateEventInput } from "@/domain/repositories/EventRepository";
import { EventRepositoryImpl } from "./EventRepositoryImpl";

const eventDto = (overrides: Partial<EventResponse> = {}): EventResponse => ({
	id: "evt-1",
	coupleId: "couple-1",
	title: "데이트",
	startTime: "2026-06-06T10:00:00.000Z",
	endTime: "2026-06-06T12:00:00.000Z",
	category: "DATE",
	authorId: "user-1",
	description: null,
	location: null,
	createdAt: "2026-06-01T00:00:00.000Z",
	updatedAt: "2026-06-01T00:00:00.000Z",
	...overrides,
});

const makeDataSource = (): EventDataSource =>
	({
		getEvents: vi.fn(async () => [eventDto()]),
		createEvent: vi.fn(async () => eventDto({ id: "created" })),
	}) as unknown as EventDataSource;

describe("EventRepositoryImpl.getMonthlyEvents", () => {
	it("KST(+09:00) 월 경계로 datasource를 호출한다 (6월 = 30일)", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2026, 6);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2026-06-01T00:00:00+09:00",
			"2026-06-30T23:59:59+09:00",
		);
	});

	it("말일이 31일인 달(7월)의 경계를 계산한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2026, 7);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2026-07-01T00:00:00+09:00",
			"2026-07-31T23:59:59+09:00",
		);
	});

	it("윤년 2월의 말일(29일)을 계산한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await repo.getMonthlyEvents(2028, 2);

		expect(dataSource.getEvents).toHaveBeenCalledWith(
			"2028-02-01T00:00:00+09:00",
			"2028-02-29T23:59:59+09:00",
		);
	});

	it("datasource DTO를 도메인 Event로 파싱해 반환한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		const events = await repo.getMonthlyEvents(2026, 6);

		expect(events).toHaveLength(1);
		expect(events[0].id).toBe("evt-1");
	});

	it.each([0, 13, -1])("month가 1..12 범위 밖(%s)이면 에러를 던지고 호출하지 않는다", async (month) => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);

		await expect(repo.getMonthlyEvents(2026, month)).rejects.toThrow(
			`month must be 1..12, got ${month}`,
		);
		expect(dataSource.getEvents).not.toHaveBeenCalled();
	});
});

describe("EventRepositoryImpl.createEvent", () => {
	it("입력을 datasource에 전달하고 파싱된 결과를 반환한다", async () => {
		const dataSource = makeDataSource();
		const repo = new EventRepositoryImpl(dataSource);
		const input: CreateEventInput = {
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE",
			description: null,
			location: null,
		};

		const created = await repo.createEvent(input);

		expect(dataSource.createEvent).toHaveBeenCalledWith(input);
		expect(created.id).toBe("created");
	});
});
