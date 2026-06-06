import { describe, expect, it } from "vitest";
import User from "./User";

describe("User", () => {
	it("생성자 인자를 모든 필드에 순서대로 할당한다", () => {
		const user = new User(
			"user-1",
			"me@example.com",
			"홍길동",
			"길동",
			"1995-03-15",
			"안녕하세요",
			"자기",
			"couple-1",
		);

		expect(user).toMatchObject({
			id: "user-1",
			email: "me@example.com",
			name: "홍길동",
			nickname: "길동",
			birthday: "1995-03-15",
			bio: "안녕하세요",
			partnerNickname: "자기",
			coupleId: "couple-1",
		});
	});

	it("선택 필드는 null을 허용한다", () => {
		const user = new User("user-2", "x@example.com", "이름", "닉", null, null, null, null);

		expect(user.birthday).toBeNull();
		expect(user.bio).toBeNull();
		expect(user.partnerNickname).toBeNull();
		expect(user.coupleId).toBeNull();
	});
});
