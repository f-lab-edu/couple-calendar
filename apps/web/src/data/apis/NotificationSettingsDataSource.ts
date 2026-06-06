import type { UpdateNotificationSettingsRequest } from "@/data/dto/notification-settings-request";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";

/**
 * Remote data source for notification settings.
 *
 * Uses relative URLs so the browser-side MSW worker can intercept the calls.
 */
export class NotificationSettingsDataSource {
	async getMine(): Promise<NotificationSettingsResponse> {
		const response = await fetch("/api/users/me/notifications", {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch notification settings: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as NotificationSettingsResponse;
	}

	async update(request: UpdateNotificationSettingsRequest): Promise<NotificationSettingsResponse> {
		const response = await fetch("/api/users/me/notifications", {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to update notification settings: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as NotificationSettingsResponse;
	}
}
