import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type InviteCode from "../entities/InviteCode";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import { GenerateInviteCodeUseCase } from "./GenerateInviteCodeUseCase";

const makeRepository = (): CoupleRepository => ({
	invite: vi.fn(async () => ({ code: "ABC123", expiresAt: "2026-06-13T00:00:00.000Z" }) as InviteCode),
	connect: vi.fn(),
	getMyCouple: vi.fn(),
	updateStartDate: vi.fn(),
	disconnect: vi.fn(),
});

describe("GenerateInviteCodeUseCase", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-06-06T09:00:00.000Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("과거 시작일이면 repository.invite에 위임하고 코드를 반환한다", async () => {
		const repository = makeRepository();
		const useCase = new GenerateInviteCodeUseCase(repository);

		const result = await useCase.execute("2026-01-01");

		expect(repository.invite).toHaveBeenCalledWith("2026-01-01");
		expect(result.code).toBe("ABC123");
	});

	it("오늘 날짜는 허용한다", async () => {
		const repository = makeRepository();
		const useCase = new GenerateInviteCodeUseCase(repository);

		await useCase.execute("2026-06-06");

		expect(repository.invite).toHaveBeenCalledWith("2026-06-06");
	});

	it("앞뒤 공백을 제거한 뒤 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new GenerateInviteCodeUseCase(repository);

		await useCase.execute("  2026-01-01  ");

		expect(repository.invite).toHaveBeenCalledWith("2026-01-01");
	});

	it.each(["2026/01/01", "2026-1-1", "20260101", "내일", ""])(
		"형식이 잘못된 날짜(%s)면 에러를 던진다",
		async (date) => {
			const repository = makeRepository();
			const useCase = new GenerateInviteCodeUseCase(repository);

			await expect(useCase.execute(date)).rejects.toThrow("시작일을 올바르게 선택해 주세요.");
			expect(repository.invite).not.toHaveBeenCalled();
		},
	);

	it("형식은 맞지만 존재하지 않는 날짜(2026-13-45)면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new GenerateInviteCodeUseCase(repository);

		await expect(useCase.execute("2026-13-45")).rejects.toThrow("시작일을 올바르게 선택해 주세요.");
		expect(repository.invite).not.toHaveBeenCalled();
	});

	it("미래 시작일이면 에러를 던진다", async () => {
		const repository = makeRepository();
		const useCase = new GenerateInviteCodeUseCase(repository);

		await expect(useCase.execute("2026-06-07")).rejects.toThrow(
			"시작일은 오늘 이후로 정할 수 없어요.",
		);
		expect(repository.invite).not.toHaveBeenCalled();
	});
});
