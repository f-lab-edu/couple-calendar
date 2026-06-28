import { describe, expect, it, vi } from "vitest";
import type Event from "../entities/Event";
import type { EventRepository, UpdateEventInput } from "../repositories/EventRepository";
import { UpdateEventUseCase } from "./UpdateEventUseCase";

const makeRepository = (): EventRepository => ({
	getMonthlyEvents: vi.fn(),
	getAllEvents: vi.fn(),
	createEvent: vi.fn(),
	updateEvent: vi.fn(
		async (id: string, input: UpdateEventInput) =>
			({ id, coupleId: "c-1", title: "t", ...input }) as Event,
	),
	deleteEvent: vi.fn(),
});

describe("UpdateEventUseCase", () => {
	it("유효한 부분 입력이면 repository.updateEvent에 위임하고 결과를 반환한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateEventUseCase(repository);
		const input: UpdateEventInput = { title: "수정됨" };

		const result = await useCase.execute("evt-1", input);

		expect(repository.updateEvent).toHaveBeenCalledWith("evt-1", input);
		expect(result.id).toBe("evt-1");
	});

	it("id가 비어 있으면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateEventUseCase(repository);

		await expect(useCase.execute("   ", { title: "x" })).rejects.toThrow(
			"수정할 일정을 찾을 수 없습니다.",
		);
		expect(repository.updateEvent).not.toHaveBeenCalled();
	});

	it("제목이 공백뿐이면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateEventUseCase(repository);

		await expect(useCase.execute("evt-1", { title: "   " })).rejects.toThrow(
			"일정 제목을 입력해주세요.",
		);
		expect(repository.updateEvent).not.toHaveBeenCalled();
	});

	it("시작/종료를 함께 보낼 때 종료가 시작보다 빠르면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateEventUseCase(repository);

		await expect(
			useCase.execute("evt-1", {
				startTime: "2026-06-06T12:00:00.000Z",
				endTime: "2026-06-06T10:00:00.000Z",
			}),
		).rejects.toThrow("종료 시간은 시작 시간보다 뒤여야 합니다.");
		expect(repository.updateEvent).not.toHaveBeenCalled();
	});

	it("title이 undefined면(미수정) 제목 검증을 건너뛴다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateEventUseCase(repository);

		await expect(useCase.execute("evt-1", { location: "성수" })).resolves.toBeDefined();
		expect(repository.updateEvent).toHaveBeenCalledWith("evt-1", { location: "성수" });
	});
});
