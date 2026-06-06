import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import NotificationSettings from "@/domain/entities/NotificationSettings";

export const parseNotificationSettings = (raw: NotificationSettingsResponse): NotificationSettings =>
	new NotificationSettings(
		raw.eventEnabled,
		raw.eventReminder,
		raw.anniversaryEnabled,
		raw.anniversaryReminder,
		raw.partnerActivityEnabled,
	);
