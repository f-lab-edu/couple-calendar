import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { CoupleDataSource } from "./CoupleDataSource";

describe("CoupleDataSource.invite", () => {
	it("startDate를 body에 담아 POST한다", async () => {
		const fetchMock = stubFetchJson({ inviteCode: "ABC123", expiresAt: "x" });
		await new CoupleDataSource().invite("2025-01-01");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/invite");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual({ startDate: "2025-01-01" });
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(500, "Server Error");
		await expect(new CoupleDataSource().invite("x")).rejects.toThrow(
			"Failed to create invite code: 500 Server Error",
		);
	});
});

describe("CoupleDataSource.connect", () => {
	it("inviteCode를 body에 담아 POST하고 결과를 반환한다", async () => {
		const couple = { id: "couple-1" };
		const fetchMock = stubFetchJson(couple);
		const result = await new CoupleDataSource().connect("ABC123");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/connect");
		expect(JSON.parse(init?.body as string)).toEqual({ inviteCode: "ABC123" });
		expect(result).toEqual(couple);
	});

	it("실패 응답의 body.message를 에러 메시지로 사용한다", async () => {
		stubFetchError(409, "Conflict", { message: "이미 연결된 커플입니다." });
		await expect(new CoupleDataSource().connect("ABC123")).rejects.toThrow(
			"이미 연결된 커플입니다.",
		);
	});

	it("실패 body에 message가 없으면 fallback 메시지를 던진다", async () => {
		stubFetchError(409, "Conflict", {});
		await expect(new CoupleDataSource().connect("ABC123")).rejects.toThrow(
			"Failed to connect couple: 409 Conflict",
		);
	});
});

describe("CoupleDataSource.getMyCouple", () => {
	it("GET /api/couples/me", async () => {
		const fetchMock = stubFetchJson({ id: "couple-1" });
		await new CoupleDataSource().getMyCouple();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("GET");
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(404, "Not Found");
		await expect(new CoupleDataSource().getMyCouple()).rejects.toThrow(
			"Failed to fetch couple: 404 Not Found",
		);
	});
});

describe("CoupleDataSource.updateStartDate", () => {
	it("PATCH /api/couples/me 에 startDate를 보낸다", async () => {
		const fetchMock = stubFetchJson({ id: "couple-1" });
		await new CoupleDataSource().updateStartDate("2025-02-02");
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ startDate: "2025-02-02" });
	});
});

describe("CoupleDataSource.disconnect", () => {
	it("DELETE /api/couples/me", async () => {
		const fetchMock = stubFetchJson({});
		await new CoupleDataSource().disconnect();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/couples/me");
		expect(init?.method).toBe("DELETE");
	});

	it("실패 시 에러를 던진다", async () => {
		stubFetchError(500, "Server Error");
		await expect(new CoupleDataSource().disconnect()).rejects.toThrow(
			"Failed to disconnect couple: 500 Server Error",
		);
	});
});
