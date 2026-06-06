import { describe, expect, it, vi } from "vitest";
import type Couple from "../entities/Couple";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import { ConnectCoupleUseCase } from "./ConnectCoupleUseCase";

const makeRepository = (): CoupleRepository => ({
	invite: vi.fn(),
	connect: vi.fn(async () => ({ id: "couple-1" }) as Couple),
	getMyCouple: vi.fn(),
	updateStartDate: vi.fn(),
	disconnect: vi.fn(),
});

describe("ConnectCoupleUseCase", () => {
	it("정상 코드면 정규화 후 repository.connect에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new ConnectCoupleUseCase(repository);

		const result = await useCase.execute("abc123");

		expect(repository.connect).toHaveBeenCalledWith("ABC123");
		expect(result.id).toBe("couple-1");
	});

	it("앞뒤 공백을 제거하고 대문자로 변환한다", async () => {
		const repository = makeRepository();
		const useCase = new ConnectCoupleUseCase(repository);

		await useCase.execute("  ab12cd  ");

		expect(repository.connect).toHaveBeenCalledWith("AB12CD");
	});

	it.each(["12345", "1234567", "ABCD!2", "한글코드", ""])(
		"형식이 잘못된 코드(%s)면 에러를 던지고 위임하지 않는다",
		async (code) => {
			const repository = makeRepository();
			const useCase = new ConnectCoupleUseCase(repository);

			await expect(useCase.execute(code)).rejects.toThrow(
				"초대 코드는 6자리 영문/숫자여야 합니다.",
			);
			expect(repository.connect).not.toHaveBeenCalled();
		},
	);
});
