import { describe, expect, it } from "vitest";
import Couple from "./Couple";

describe("Couple", () => {
	it("생성자 인자를 모든 필드에 순서대로 할당한다", () => {
		const couple = new Couple(
			"couple-1",
			"user-1",
			"user-2",
			"2025-01-01",
			"ABC123",
			"2025-01-08T00:00:00.000Z",
			365,
			true,
		);

		expect(couple).toMatchObject({
			id: "couple-1",
			user1Id: "user-1",
			user2Id: "user-2",
			startDate: "2025-01-01",
			inviteCode: "ABC123",
			inviteCodeExpiresAt: "2025-01-08T00:00:00.000Z",
			daysFromStart: 365,
			isComplete: true,
		});
	});

	it("아직 연결되지 않은 커플은 user2Id/초대코드가 null이고 미완성이다", () => {
		const couple = new Couple("couple-2", "user-1", null, "2025-01-01", null, null, 0, false);

		expect(couple.user2Id).toBeNull();
		expect(couple.inviteCode).toBeNull();
		expect(couple.inviteCodeExpiresAt).toBeNull();
		expect(couple.isComplete).toBe(false);
	});
});
