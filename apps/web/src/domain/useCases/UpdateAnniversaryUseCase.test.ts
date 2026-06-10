import { describe, expect, it, vi } from "vitest";
import type Anniversary from "../entities/Anniversary";
import type {
	AnniversaryRepository,
	UpdateAnniversaryInput,
} from "../repositories/AnniversaryRepository";
import { UpdateAnniversaryUseCase } from "./UpdateAnniversaryUseCase";

const makeRepository = (): AnniversaryRepository => ({
	getAnniversaries: vi.fn(),
	addAnniversary: vi.fn(),
	updateAnniversary: vi.fn(
		async (id: string, input: UpdateAnniversaryInput) =>
			({ id, coupleId: "c-1", title: "t", date: "2026-01-01", ...input }) as Anniversary,
	),
	deleteAnniversary: vi.fn(),
});

describe("UpdateAnniversaryUseCase", () => {
	it("유효한 부분 입력이면 repository.updateAnniversary에 위임하고 결과를 반환한다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateAnniversaryUseCase(repository);
		const input: UpdateAnniversaryInput = { title: "수정됨" };

		const result = await useCase.execute("a-1", input);

		expect(repository.updateAnniversary).toHaveBeenCalledWith("a-1", input);
		expect(result.id).toBe("a-1");
	});

	it("id가 비어 있으면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateAnniversaryUseCase(repository);

		await expect(useCase.execute("   ", { title: "x" })).rejects.toThrow(
			"수정할 기념일을 찾을 수 없습니다.",
		);
		expect(repository.updateAnniversary).not.toHaveBeenCalled();
	});

	it("제목이 공백뿐이면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateAnniversaryUseCase(repository);

		await expect(useCase.execute("a-1", { title: "   " })).rejects.toThrow(
			"기념일 제목을 입력해주세요.",
		);
		expect(repository.updateAnniversary).not.toHaveBeenCalled();
	});

	it("날짜가 공백뿐이면 에러를 던지고 repository를 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateAnniversaryUseCase(repository);

		await expect(useCase.execute("a-1", { date: "   " })).rejects.toThrow(
			"기념일 날짜를 선택해주세요.",
		);
		expect(repository.updateAnniversary).not.toHaveBeenCalled();
	});

	it("title이 undefined면(미수정) 제목 검증을 건너뛴다", async () => {
		const repository = makeRepository();
		const useCase = new UpdateAnniversaryUseCase(repository);

		await expect(useCase.execute("a-1", { description: "메모" })).resolves.toBeDefined();
		expect(repository.updateAnniversary).toHaveBeenCalledWith("a-1", { description: "메모" });
	});
});
