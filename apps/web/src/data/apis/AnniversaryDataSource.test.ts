import { describe, expect, it } from "vitest";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import { AnniversaryDataSource } from "./AnniversaryDataSource";

describe("AnniversaryDataSource", () => {
	it("getAnniversaries: mock 데이터를 반환한다", async () => {
		const result = await new AnniversaryDataSource().getAnniversaries();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it("addAnniversary: 예외 없이 resolve한다 (현재 no-op stub)", async () => {
		const anniversary = { id: "a-1" } as AnniversaryResponse;
		await expect(
			new AnniversaryDataSource().addAnniversary(anniversary),
		).resolves.toBeUndefined();
	});
});
