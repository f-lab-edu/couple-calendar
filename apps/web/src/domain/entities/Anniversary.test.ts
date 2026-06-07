import { describe, expect, it } from "vitest";
import Anniversary from "./Anniversary";

describe("Anniversary", () => {
	it("생성자 인자를 모든 필드에 순서대로 할당한다", () => {
		const anniversary = new Anniversary(
			"a-1",
			"couple-1",
			"처음 만난 날",
			"2025-01-01",
			true,
			"설명",
			"CUSTOM",
			30,
		);

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

	it("description은 null을 허용한다", () => {
		const anniversary = new Anniversary("a-2", "couple-1", "100일", "2025-04-10", false, null, "AUTO", 5);

		expect(anniversary.description).toBeNull();
		expect(anniversary.type).toBe("AUTO");
	});
});
