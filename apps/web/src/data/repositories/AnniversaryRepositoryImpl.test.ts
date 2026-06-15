import { describe, expect, it, vi } from "vitest";
import type { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import Anniversary from "@/domain/entities/Anniversary";
import type { UpdateAnniversaryInput } from "@/domain/repositories/AnniversaryRepository";
import { AnniversaryRepositoryImpl } from "./AnniversaryRepositoryImpl";

const dto = (overrides: Partial<AnniversaryResponse> = {}): AnniversaryResponse => ({
	id: "a-1",
	coupleId: "couple-1",
	title: "처음 만난 날",
	date: "2025-01-01",
	isRecurring: true,
	description: null,
	type: "CUSTOM",
	daysUntil: 10,
	...overrides,
});

const makeDataSource = (): AnniversaryDataSource =>
	({
		getAnniversaries: vi.fn(async () => [dto()]),
		addAnniversary: vi.fn(async () => dto({ id: "created" })),
		updateAnniversary: vi.fn(async () => dto({ id: "updated", title: "수정됨" })),
		deleteAnniversary: vi.fn(async () => undefined),
	}) as unknown as AnniversaryDataSource;

describe("AnniversaryRepositoryImpl.getAnniversaries", () => {
	it("datasource DTO를 도메인 Anniversary로 파싱해 반환한다", async () => {
		const ds = makeDataSource();
		const result = await new AnniversaryRepositoryImpl(ds).getAnniversaries();

		expect(ds.getAnniversaries).toHaveBeenCalledTimes(1);
		expect(result).toHaveLength(1);
		expect(result[0]).toBeInstanceOf(Anniversary);
		expect(result[0].id).toBe("a-1");
		expect(result[0].type).toBe("CUSTOM");
	});
});

describe("AnniversaryRepositoryImpl.addAnniversary", () => {
	it("엔티티를 요청으로 변환해 datasource에 전달하고 파싱된 결과를 반환한다", async () => {
		const ds = makeDataSource();
		const anniversary = new Anniversary(
			"tmp",
			"couple-1",
			"100일",
			"2025-04-10",
			false,
			"메모",
			"CUSTOM",
			0,
		);

		const created = await new AnniversaryRepositoryImpl(ds).addAnniversary(anniversary);

		expect(ds.addAnniversary).toHaveBeenCalledWith({
			title: "100일",
			date: "2025-04-10",
			isRecurring: false,
			description: "메모",
		});
		expect(created.id).toBe("created");
	});
});

describe("AnniversaryRepositoryImpl.updateAnniversary", () => {
	it("부분 입력을 datasource에 전달하고 파싱된 결과를 반환한다", async () => {
		const ds = makeDataSource();
		const input: UpdateAnniversaryInput = { title: "수정됨" };

		const updated = await new AnniversaryRepositoryImpl(ds).updateAnniversary("a-1", input);

		expect(ds.updateAnniversary).toHaveBeenCalledWith("a-1", {
			title: "수정됨",
			date: undefined,
			isRecurring: undefined,
			description: undefined,
		});
		expect(updated.id).toBe("updated");
		expect(updated.title).toBe("수정됨");
	});
});

describe("AnniversaryRepositoryImpl.deleteAnniversary", () => {
	it("id로 datasource.deleteAnniversary를 호출한다", async () => {
		const ds = makeDataSource();
		const repo = new AnniversaryRepositoryImpl(ds);

		await expect(repo.deleteAnniversary("a-1")).resolves.toBeUndefined();

		expect(ds.deleteAnniversary).toHaveBeenCalledWith("a-1");
	});
});
