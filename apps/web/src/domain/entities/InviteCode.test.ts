import { describe, expect, it } from "vitest";
import InviteCode from "./InviteCode";

describe("InviteCode", () => {
	it("code와 expiresAt을 할당한다", () => {
		const inviteCode = new InviteCode("ABC123", "2026-06-13T00:00:00.000Z");

		expect(inviteCode.code).toBe("ABC123");
		expect(inviteCode.expiresAt).toBe("2026-06-13T00:00:00.000Z");
	});
});
