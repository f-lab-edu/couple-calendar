import { describe, expect, it, vi } from "vitest";
import type { CoupleRepository } from "../repositories/CoupleRepository";
import { DisconnectCoupleUseCase } from "./DisconnectCoupleUseCase";

describe("DisconnectCoupleUseCase", () => {
	it("repository.disconnect에 위임한다", async () => {
		const repository: CoupleRepository = {
			invite: vi.fn(),
			connect: vi.fn(),
			getMyCouple: vi.fn(),
			updateStartDate: vi.fn(),
			disconnect: vi.fn(async () => undefined),
		};
		const useCase = new DisconnectCoupleUseCase(repository);

		await useCase.execute();

		expect(repository.disconnect).toHaveBeenCalledTimes(1);
	});
});
