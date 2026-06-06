import { describe, expect, it, vi } from "vitest";
import type { CoupleDataSource } from "@/data/apis/CoupleDataSource";
import type { CoupleResponse, InviteCodeResponse } from "@/data/dto/couple-response";
import { CoupleRepositoryImpl } from "./CoupleRepositoryImpl";

const coupleDto: CoupleResponse = {
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
};

const inviteDto: InviteCodeResponse = {
	inviteCode: "ABC123",
	expiresAt: "2026-06-13T00:00:00.000Z",
};

const makeDataSource = (): CoupleDataSource =>
	({
		invite: vi.fn(async () => inviteDto),
		connect: vi.fn(async () => coupleDto),
		getMyCouple: vi.fn(async () => coupleDto),
		updateStartDate: vi.fn(async () => coupleDto),
		disconnect: vi.fn(async () => undefined),
	}) as unknown as CoupleDataSource;

describe("CoupleRepositoryImpl", () => {
	it("invite: startDate 전달 + InviteCode 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).invite("2025-01-01");
		expect(ds.invite).toHaveBeenCalledWith("2025-01-01");
		expect(result.code).toBe("ABC123");
		expect(result.expiresAt).toBe("2026-06-13T00:00:00.000Z");
	});

	it("connect: inviteCode 전달 + Couple 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).connect("ABC123");
		expect(ds.connect).toHaveBeenCalledWith("ABC123");
		expect(result.id).toBe("couple-1");
	});

	it("getMyCouple: Couple 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).getMyCouple();
		expect(ds.getMyCouple).toHaveBeenCalledTimes(1);
		expect(result.user1Id).toBe("user-1");
	});

	it("updateStartDate: startDate 전달 + Couple 파싱", async () => {
		const ds = makeDataSource();
		const result = await new CoupleRepositoryImpl(ds).updateStartDate("2025-02-02");
		expect(ds.updateStartDate).toHaveBeenCalledWith("2025-02-02");
		expect(result.id).toBe("couple-1");
	});

	it("disconnect: datasource에 위임", async () => {
		const ds = makeDataSource();
		await new CoupleRepositoryImpl(ds).disconnect();
		expect(ds.disconnect).toHaveBeenCalledTimes(1);
	});
});
