import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { UserDataSource } from "./UserDataSource";

describe("UserDataSource", () => {
	it("getMe: GET /api/users/me", async () => {
		const fetchMock = stubFetchJson({ id: "user-1" });
		const result = await new UserDataSource().getMe();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me");
		expect(init?.method).toBe("GET");
		expect(result).toEqual({ id: "user-1" });
	});

	it("getMe: 실패 시 에러", async () => {
		stubFetchError(401, "Unauthorized");
		await expect(new UserDataSource().getMe()).rejects.toThrow(
			"Failed to fetch current user: 401 Unauthorized",
		);
	});

	it("getById: id를 경로에 넣어 GET", async () => {
		const fetchMock = stubFetchJson({ id: "user-2" });
		await new UserDataSource().getById("user-2");
		expect(fetchMock.mock.calls[0][0]).toBe("/api/users/user-2");
	});

	it("getById: 실패 시 id 포함 에러", async () => {
		stubFetchError(404, "Not Found");
		await expect(new UserDataSource().getById("user-2")).rejects.toThrow(
			"Failed to fetch user user-2: 404 Not Found",
		);
	});

	it("updateMe: PATCH body 직렬화", async () => {
		const fetchMock = stubFetchJson({ id: "user-1" });
		await new UserDataSource().updateMe({ nickname: "새닉" });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ nickname: "새닉" });
	});

	it("updateMe: 실패 시 에러", async () => {
		stubFetchError(400, "Bad Request");
		await expect(new UserDataSource().updateMe({})).rejects.toThrow(
			"Failed to update profile: 400 Bad Request",
		);
	});
});
