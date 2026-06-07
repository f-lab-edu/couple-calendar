import { describe, expect, it } from "vitest";
import type { UserResponse } from "@/data/dto/user-response";
import { parseUser } from "./userParser";

const dto = (overrides: Partial<UserResponse> = {}): UserResponse => ({
	id: "user-1",
	email: "me@example.com",
	name: "홍길동",
	nickname: "길동",
	birthday: "1995-03-15",
	bio: "안녕",
	partnerNickname: "자기",
	coupleId: "couple-1",
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

describe("parseUser", () => {
	it("DTO를 도메인 User로 매핑한다", () => {
		expect(parseUser(dto())).toMatchObject({
			id: "user-1",
			email: "me@example.com",
			name: "홍길동",
			nickname: "길동",
			birthday: "1995-03-15",
			bio: "안녕",
			partnerNickname: "자기",
			coupleId: "couple-1",
		});
	});

	it("nullable 필드를 보존한다", () => {
		const user = parseUser(
			dto({ birthday: null, bio: null, partnerNickname: null, coupleId: null }),
		);
		expect(user.birthday).toBeNull();
		expect(user.bio).toBeNull();
		expect(user.partnerNickname).toBeNull();
		expect(user.coupleId).toBeNull();
	});
});
