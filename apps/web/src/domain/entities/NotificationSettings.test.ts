import { describe, expect, it } from "vitest";
import NotificationSettings from "./NotificationSettings";

describe("NotificationSettings", () => {
	it("생성자 인자를 모든 필드에 순서대로 할당한다", () => {
		const settings = new NotificationSettings(true, "1_DAY_BEFORE", false, "3_DAYS_BEFORE", true);

		expect(settings).toMatchObject({
			eventEnabled: true,
			eventReminder: "1_DAY_BEFORE",
			anniversaryEnabled: false,
			anniversaryReminder: "3_DAYS_BEFORE",
			partnerActivityEnabled: true,
		});
	});
});
