import { describe, expect, it } from "vitest";
import type { InviteCodeResponse } from "@/data/dto/couple-response";
import { parseInviteCode } from "./inviteCodeParser";

describe("parseInviteCode", () => {
	it("DTO의 inviteCode를 도메인 code로 매핑한다", () => {
		const dto: InviteCodeResponse = {
			inviteCode: "ABC123",
			expiresAt: "2026-06-13T00:00:00.000Z",
		};
		const inviteCode = parseInviteCode(dto);
		expect(inviteCode.code).toBe("ABC123");
		expect(inviteCode.expiresAt).toBe("2026-06-13T00:00:00.000Z");
	});
});
