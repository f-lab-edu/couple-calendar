import { describe, expect, it } from "vitest";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import AnniversaryParser from "./anniversaryParser";

const dto = (overrides: Partial<AnniversaryResponse> = {}): AnniversaryResponse => ({
	id: "a-1",
	coupleId: "couple-1",
	title: "처음 만난 날",
	date: "2025-01-01",
	isRecurring: true,
	description: "설명",
	type: "CUSTOM",
	daysUntil: 30,
	...overrides,
});

describe("AnniversaryParser", () => {
	it("DTO 배열을 도메인 Anniversary 배열로 매핑한다", () => {
		const [anniversary] = AnniversaryParser([dto()]);
		expect(anniversary).toMatchObject({
			id: "a-1",
			coupleId: "couple-1",
			title: "처음 만난 날",
			date: "2025-01-01",
			isRecurring: true,
			description: "설명",
			type: "CUSTOM",
			daysUntil: 30,
		});
	});

	it("AUTO 타입과 null description을 처리한다", () => {
		const [anniversary] = AnniversaryParser([dto({ type: "AUTO", description: null })]);
		expect(anniversary.type).toBe("AUTO");
		expect(anniversary.description).toBeNull();
	});

	it("허용되지 않은 type이면 에러를 던진다", () => {
		expect(() => AnniversaryParser([dto({ type: "X" as never })])).toThrow(
			"Unknown anniversary type from server: X",
		);
	});

	it("빈 배열이면 빈 배열을 반환한다", () => {
		expect(AnniversaryParser([])).toEqual([]);
	});
});
