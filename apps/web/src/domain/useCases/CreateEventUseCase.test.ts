import { describe, expect, it, vi } from "vitest";
import type Event from "../entities/Event";
import type { CreateEventInput, EventRepository } from "../repositories/EventRepository";
import { CreateEventUseCase } from "./CreateEventUseCase";

const validInput = (overrides: Partial<CreateEventInput> = {}): CreateEventInput => ({
	title: "데이트",
	startTime: "2026-06-06T10:00:00.000Z",
	endTime: "2026-06-06T12:00:00.000Z",
	category: "DATE",
	description: null,
	location: null,
	...overrides,
});

const makeRepository = (): EventRepository => ({
	getMonthlyEvents: vi.fn(),
	createEvent: vi.fn(async (input: CreateEventInput) => ({ id: "evt-1", coupleId: "c-1", ...input }) as Event),
	updateEvent: vi.fn(),
	deleteEvent: vi.fn(),
});

describe("CreateEventUseCase", () => {
	it("유효한 입력이면 repository.createEvent에 위임하고 결과를 반환한다", async () => {
		const repository = makeRepository();
		const useCase = new CreateEventUseCase(repository);
		const input = validInput();

		const result = await useCase.execute(input);

		expect(repository.createEvent).toHaveBeenCalledWith(input);
		expect(result.id).toBe("evt-1");
	});

	it("제목이 공백뿐이면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new CreateEventUseCase(repository);

		await expect(useCase.execute(validInput({ title: "   " }))).rejects.toThrow(
			"일정 제목을 입력해주세요.",
		);
		expect(repository.createEvent).not.toHaveBeenCalled();
	});

	it("종료 시간이 시작 시간보다 빠르면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new CreateEventUseCase(repository);

		await expect(
			useCase.execute(
				validInput({
					startTime: "2026-06-06T12:00:00.000Z",
					endTime: "2026-06-06T10:00:00.000Z",
				}),
			),
		).rejects.toThrow("종료 시간은 시작 시간보다 뒤여야 합니다.");
		expect(repository.createEvent).not.toHaveBeenCalled();
	});

	it("종료 시간과 시작 시간이 같으면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new CreateEventUseCase(repository);
		const sameTime = "2026-06-06T10:00:00.000Z";

		await expect(
			useCase.execute(validInput({ startTime: sameTime, endTime: sameTime })),
		).rejects.toThrow("종료 시간은 시작 시간보다 뒤여야 합니다.");
	});
});
