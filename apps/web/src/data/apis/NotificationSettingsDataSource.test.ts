import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { NotificationSettingsDataSource } from "./NotificationSettingsDataSource";

describe("NotificationSettingsDataSource", () => {
	it("getMine: GET /api/users/me/notifications", async () => {
		const fetchMock = stubFetchJson({ eventEnabled: true });
		await new NotificationSettingsDataSource().getMine();
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me/notifications");
		expect(init?.method).toBe("GET");
	});

	it("getMine: 실패 시 에러", async () => {
		stubFetchError(500, "Server Error");
		await expect(new NotificationSettingsDataSource().getMine()).rejects.toThrow(
			"Failed to fetch notification settings: 500 Server Error",
		);
	});

	it("update: PATCH body 직렬화", async () => {
		const fetchMock = stubFetchJson({ eventEnabled: false });
		await new NotificationSettingsDataSource().update({ eventEnabled: false });
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/users/me/notifications");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual({ eventEnabled: false });
	});

	it("update: 실패 시 에러", async () => {
		stubFetchError(400, "Bad Request");
		await expect(
			new NotificationSettingsDataSource().update({}),
		).rejects.toThrow("Failed to update notification settings: 400 Bad Request");
	});
});
