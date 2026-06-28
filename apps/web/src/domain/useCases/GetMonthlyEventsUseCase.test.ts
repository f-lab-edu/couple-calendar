import { describe, expect, it, vi } from "vitest";
import type Event from "../entities/Event";
import type { EventRepository } from "../repositories/EventRepository";
import { GetMonthlyEventsUseCase } from "./GetMonthlyEventsUseCase";

describe("GetMonthlyEventsUseCase", () => {
	it("year/month를 그대로 전달하고 결과를 반환한다", async () => {
		const events = [{ id: "evt-1" }] as Event[];
		const repository: EventRepository = {
			getMonthlyEvents: vi.fn(async () => events),
			getAllEvents: vi.fn(async () => events),
			createEvent: vi.fn(),
			updateEvent: vi.fn(),
			deleteEvent: vi.fn(),
		};
		const useCase = new GetMonthlyEventsUseCase(repository);

		const result = await useCase.execute(2026, 6);

		expect(repository.getMonthlyEvents).toHaveBeenCalledWith(2026, 6);
		expect(result).toBe(events);
	});
});
