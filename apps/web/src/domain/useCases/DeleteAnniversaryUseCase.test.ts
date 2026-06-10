import { describe, expect, it, vi } from "vitest";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";
import { DeleteAnniversaryUseCase } from "./DeleteAnniversaryUseCase";

const makeRepository = (): AnniversaryRepository => ({
	getAnniversaries: vi.fn(),
	addAnniversary: vi.fn(),
	updateAnniversary: vi.fn(),
	deleteAnniversary: vi.fn(async () => undefined),
});

describe("DeleteAnniversaryUseCase", () => {
	it("유효한 id면 repository.deleteAnniversary에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new DeleteAnniversaryUseCase(repository);

		await expect(useCase.execute("a-1")).resolves.toBeUndefined();

		expect(repository.deleteAnniversary).toHaveBeenCalledWith("a-1");
	});

	it("id가 비어 있으면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new DeleteAnniversaryUseCase(repository);

		await expect(useCase.execute("   ")).rejects.toThrow("삭제할 기념일을 찾을 수 없습니다.");
		expect(repository.deleteAnniversary).not.toHaveBeenCalled();
	});
});
