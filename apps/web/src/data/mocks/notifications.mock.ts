import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";

export const mockNotificationSettings: NotificationSettingsResponse = {
	eventEnabled: true,
	eventReminder: "하루 전",
	anniversaryEnabled: true,
	anniversaryReminder: "당일",
	partnerActivityEnabled: false,
};
