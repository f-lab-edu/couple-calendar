import { describe, expect, it, vi } from "vitest";
import type { AnniversaryDataSource } from "@/data/apis/AnniversaryDataSource";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import type Anniversary from "@/domain/entities/Anniversary";
import { AnniversaryRepositoryImpl } from "./AnniversaryRepositoryImpl";

const dto: AnniversaryResponse = {
	id: "a-1",
	coupleId: "couple-1",
	title: "처음 만난 날",
	date: "2025-01-01",
	isRecurring: true,
	description: null,
	type: "AUTO",
	daysUntil: 10,
};

const makeDataSource = (): AnniversaryDataSource =>
	({
		getAnniversaries: vi.fn(async () => [dto]),
		addAnniversary: vi.fn(async () => undefined),
	}) as unknown as AnniversaryDataSource;

describe("AnniversaryRepositoryImpl", () => {
	it("getAnniversaries: datasource 결과를 반환한다", async () => {
		const ds = makeDataSource();
		const result = await new AnniversaryRepositoryImpl(ds).getAnniversaries();
		expect(ds.getAnniversaries).toHaveBeenCalledTimes(1);
		expect(result).toEqual([dto]);
	});

	it("addAnniversary: datasource에 위임한다", async () => {
		const ds = makeDataSource();
		const anniversary = { id: "a-1" } as Anniversary;
		await new AnniversaryRepositoryImpl(ds).addAnniversary(anniversary);
		expect(ds.addAnniversary).toHaveBeenCalledWith(anniversary);
	});
});
