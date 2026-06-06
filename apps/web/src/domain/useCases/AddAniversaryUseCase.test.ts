import { describe, expect, it, vi } from "vitest";
import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";
import { AddAnniversaryUseCase } from "./AddAniversaryUseCase";

describe("AddAnniversaryUseCase", () => {
	it("repository.addAnniversary에 그대로 위임한다", async () => {
		const repository: AnniversaryRepository = {
			getAnniversaries: vi.fn(),
			addAnniversary: vi.fn(async () => undefined),
		};
		const useCase = new AddAnniversaryUseCase(repository);
		const anniversary = { id: "a-1", title: "처음 만난 날" } as Anniversary;

		await useCase.execute(anniversary);

		expect(repository.addAnniversary).toHaveBeenCalledWith(anniversary);
		expect(repository.addAnniversary).toHaveBeenCalledTimes(1);
	});
});
