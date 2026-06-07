import { describe, expect, it, vi } from "vitest";
import type { NotificationSettingsDataSource } from "@/data/apis/NotificationSettingsDataSource";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import type { UpdateNotificationSettingsInput } from "@/domain/repositories/NotificationSettingsRepository";
import { NotificationSettingsRepositoryImpl } from "./NotificationSettingsRepositoryImpl";

const settingsDto = (overrides: Partial<NotificationSettingsResponse> = {}): NotificationSettingsResponse => ({
	eventEnabled: true,
	eventReminder: "1_DAY_BEFORE",
	anniversaryEnabled: true,
	anniversaryReminder: "SAME_DAY",
	partnerActivityEnabled: false,
	...overrides,
});

const makeDataSource = (): NotificationSettingsDataSource =>
	({
		getMine: vi.fn(async () => settingsDto()),
		update: vi.fn(async (input: UpdateNotificationSettingsInput) => settingsDto({ ...input })),
	}) as unknown as NotificationSettingsDataSource;

describe("NotificationSettingsRepositoryImpl", () => {
	it("getMine: 파싱 결과 반환", async () => {
		const ds = makeDataSource();
		const result = await new NotificationSettingsRepositoryImpl(ds).getMine();
		expect(ds.getMine).toHaveBeenCalledTimes(1);
		expect(result.eventEnabled).toBe(true);
	});

	it("update: 입력 전달 + 파싱", async () => {
		const ds = makeDataSource();
		const input: UpdateNotificationSettingsInput = { eventEnabled: false };
		const result = await new NotificationSettingsRepositoryImpl(ds).update(input);
		expect(ds.update).toHaveBeenCalledWith(input);
		expect(result.eventEnabled).toBe(false);
	});
});
