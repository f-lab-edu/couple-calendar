import { describe, expect, it } from "vitest";
import type { CoupleResponse } from "@/data/dto/couple-response";
import { parseCouple } from "./coupleParser";

const dto = (overrides: Partial<CoupleResponse> = {}): CoupleResponse => ({
	id: "couple-1",
	user1Id: "user-1",
	user2Id: "user-2",
	startDate: "2025-01-01",
	inviteCode: "ABC123",
	inviteCodeExpiresAt: "2025-01-08T00:00:00.000Z",
	daysFromStart: 365,
	isComplete: true,
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

describe("parseCouple", () => {
	it("DTO를 도메인 Couple로 매핑한다", () => {
		expect(parseCouple(dto())).toMatchObject({
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

	it("아직 연결 전인 커플의 nullable 필드를 보존한다", () => {
		const couple = parseCouple(
			dto({ user2Id: null, inviteCode: null, inviteCodeExpiresAt: null, isComplete: false }),
		);
		expect(couple.user2Id).toBeNull();
		expect(couple.inviteCode).toBeNull();
		expect(couple.inviteCodeExpiresAt).toBeNull();
		expect(couple.isComplete).toBe(false);
	});
});
