import { describe, expect, it, vi } from "vitest";
import type Anniversary from "../entities/Anniversary";
import type { AnniversaryRepository } from "../repositories/AnniversaryRepository";
import { AddAnniversaryUseCase } from "./AddAniversaryUseCase";

const makeRepository = (): AnniversaryRepository => ({
	getAnniversaries: vi.fn(),
	addAnniversary: vi.fn(async (a: Anniversary) => a),
	updateAnniversary: vi.fn(),
	deleteAnniversary: vi.fn(),
});

describe("AddAnniversaryUseCase", () => {
	it("유효하면 repository.addAnniversary에 위임하고 결과를 반환한다", async () => {
		const repository = makeRepository();
		const useCase = new AddAnniversaryUseCase(repository);
		const anniversary = { id: "a-1", title: "처음 만난 날", date: "2025-01-01" } as Anniversary;

		const result = await useCase.execute(anniversary);

		expect(repository.addAnniversary).toHaveBeenCalledWith(anniversary);
		expect(repository.addAnniversary).toHaveBeenCalledTimes(1);
		expect(result).toBe(anniversary);
	});

	it("제목이 공백뿐이면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new AddAnniversaryUseCase(repository);
		const anniversary = { title: "   ", date: "2025-01-01" } as Anniversary;

		await expect(useCase.execute(anniversary)).rejects.toThrow("기념일 제목을 입력해주세요.");
		expect(repository.addAnniversary).not.toHaveBeenCalled();
	});

	it("날짜가 비어 있으면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new AddAnniversaryUseCase(repository);
		const anniversary = { title: "처음 만난 날", date: "" } as Anniversary;

		await expect(useCase.execute(anniversary)).rejects.toThrow("기념일 날짜를 선택해주세요.");
		expect(repository.addAnniversary).not.toHaveBeenCalled();
	});
});
