import { describe, expect, it, vi } from "vitest";
import type { EventRepository } from "../repositories/EventRepository";
import { DeleteEventUseCase } from "./DeleteEventUseCase";

const makeRepository = (): EventRepository => ({
	getMonthlyEvents: vi.fn(),
	getAllEvents: vi.fn(),
	createEvent: vi.fn(),
	updateEvent: vi.fn(),
	deleteEvent: vi.fn(async () => undefined),
});

describe("DeleteEventUseCase", () => {
	it("유효한 id면 repository.deleteEvent에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new DeleteEventUseCase(repository);

		await expect(useCase.execute("evt-1")).resolves.toBeUndefined();

		expect(repository.deleteEvent).toHaveBeenCalledWith("evt-1");
	});

	it("id가 비어 있으면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new DeleteEventUseCase(repository);

		await expect(useCase.execute("   ")).rejects.toThrow("삭제할 일정을 찾을 수 없습니다.");
		expect(repository.deleteEvent).not.toHaveBeenCalled();
	});
});
