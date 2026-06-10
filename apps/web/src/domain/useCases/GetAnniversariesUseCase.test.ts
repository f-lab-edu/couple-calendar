import { describe, expect, it, vi } from "vitest";
import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";
import { GetAnniversariesUseCase } from "./GetAnniversariesUseCase";

describe("GetAnniversariesUseCase", () => {
	it("repository.getAnniversaries 결과를 그대로 반환한다", async () => {
		const anniversaries = [{ id: "a-1" }, { id: "a-2" }] as Anniversary[];
		const repository: AnniversaryRepository = {
			getAnniversaries: vi.fn(async () => anniversaries),
			addAnniversary: vi.fn(),
			updateAnniversary: vi.fn(),
			deleteAnniversary: vi.fn(),
		};
		const useCase = new GetAnniversariesUseCase(repository);

		const result = await useCase.execute();

		expect(repository.getAnniversaries).toHaveBeenCalledTimes(1);
		expect(result).toBe(anniversaries);
	});
});
