import { describe, expect, it } from "vitest";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import { parseNotificationSettings } from "./notificationSettingsParser";

describe("parseNotificationSettings", () => {
	it("DTO를 도메인 NotificationSettings로 매핑한다", () => {
		const dto: NotificationSettingsResponse = {
			eventEnabled: true,
			eventReminder: "1_DAY_BEFORE",
			anniversaryEnabled: false,
			anniversaryReminder: "SAME_DAY",
			partnerActivityEnabled: true,
		};
		expect(parseNotificationSettings(dto)).toMatchObject(dto);
	});
});
