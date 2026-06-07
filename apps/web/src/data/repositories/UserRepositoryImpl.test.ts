import { describe, expect, it, vi } from "vitest";
import type { UserDataSource } from "@/data/apis/UserDataSource";
import type { UserResponse } from "@/data/dto/user-response";
import type { UpdateProfileInput } from "@/domain/repositories/UserRepository";
import { UserRepositoryImpl } from "./UserRepositoryImpl";

const userDto = (overrides: Partial<UserResponse> = {}): UserResponse => ({
	id: "user-1",
	email: "me@example.com",
	name: "홍길동",
	nickname: "길동",
	birthday: null,
	bio: null,
	partnerNickname: null,
	coupleId: "couple-1",
	createdAt: "2025-01-01T00:00:00.000Z",
	updatedAt: "2025-01-01T00:00:00.000Z",
	...overrides,
});

const makeDataSource = (): UserDataSource =>
	({
		getMe: vi.fn(async () => userDto()),
		getById: vi.fn(async () => userDto({ id: "user-2", name: "파트너" })),
		updateMe: vi.fn(async (input: UpdateProfileInput) => userDto({ ...input })),
	}) as unknown as UserDataSource;

describe("UserRepositoryImpl", () => {
	it("getMe: User 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const me = await new UserRepositoryImpl(ds).getMe();
		expect(ds.getMe).toHaveBeenCalledTimes(1);
		expect(me.id).toBe("user-1");
	});

	it("getById: id 전달 + User 파싱", async () => {
		const ds = makeDataSource();
		const partner = await new UserRepositoryImpl(ds).getById("user-2");
		expect(ds.getById).toHaveBeenCalledWith("user-2");
		expect(partner.name).toBe("파트너");
	});

	it("updateMe: 입력 전달 + User 파싱", async () => {
		const ds = makeDataSource();
		const input: UpdateProfileInput = { nickname: "새닉" };
		const updated = await new UserRepositoryImpl(ds).updateMe(input);
		expect(ds.updateMe).toHaveBeenCalledWith(input);
		expect(updated.nickname).toBe("새닉");
	});
});
