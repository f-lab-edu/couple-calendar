import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type Couple from "../entities/Couple";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import { UpdateCoupleStartDateUseCase } from "./UpdateCoupleStartDateUseCase";

const makeRepository = (): CoupleRepository => ({
	invite: vi.fn(),
	connect: vi.fn(),
	getMyCouple: vi.fn(),
	updateStartDate: vi.fn(async () => ({ id: "couple-1" }) as Couple),
	disconnect: vi.fn(),
});

describe("UpdateCoupleStartDateUseCase", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-06-06T09:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("과거 시작일이면 정규화 후 repository.updateStartDate에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateCoupleStartDateUseCase(repository);

		const result = await useCase.execute("  2025-12-25  ");

		expect(repository.updateStartDate).toHaveBeenCalledWith("2025-12-25");
		expect(result.id).toBe("couple-1");
	});

	it("오늘 날짜는 허용한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateCoupleStartDateUseCase(repository);

		await useCase.execute("2026-06-06");

		expect(repository.updateStartDate).toHaveBeenCalledWith("2026-06-06");
	});

	it.each(["2026.06.06", "2026-6-6", "abc", ""])(
		"형식이 잘못된 날짜(%s)면 에러를 던진다",
		async (date) => {
			const repository = makeRepository();
			const useCase = new UpdateCoupleStartDateUseCase(repository);

			await expect(useCase.execute(date)).rejects.toThrow("시작일을 올바르게 선택해 주세요.");
			expect(repository.updateStartDate).not.toHaveBeenCalled();
		},
	);

	it("미래 시작일이면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateCoupleStartDateUseCase(repository);

		await expect(useCase.execute("2026-06-07")).rejects.toThrow(
			"시작일은 오늘 이후로 정할 수 없어요.",
		);
		expect(repository.updateStartDate).not.toHaveBeenCalled();
	});
});
