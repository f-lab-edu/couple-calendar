import { HttpResponse, http } from "msw";
import type { UpdateNotificationSettingsRequest } from "@/data/dto/notification-settings-request";
import type { NotificationSettingsResponse } from "@/data/dto/notification-settings-response";
import { mockNotificationSettings } from "../notifications.mock";

// PATCH가 누적되도록 가변 스토어로 보관한다.
let store: NotificationSettingsResponse = structuredClone(mockNotificationSettings);

export const notificationsHandlers = [
	http.get("/api/users/me/notifications", () => HttpResponse.json(store)),

	http.patch("/api/users/me/notifications", async ({ request }) => {
		let body: UpdateNotificationSettingsRequest | null = null;
		try {
			body = (await request.json()) as UpdateNotificationSettingsRequest;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		store = {
			...store,
			...(body?.eventEnabled !== undefined ? { eventEnabled: body.eventEnabled } : {}),
			...(body?.eventReminder !== undefined ? { eventReminder: body.eventReminder } : {}),
			...(body?.anniversaryEnabled !== undefined ? { anniversaryEnabled: body.anniversaryEnabled } : {}),
			...(body?.anniversaryReminder !== undefined ? { anniversaryReminder: body.anniversaryReminder } : {}),
			...(body?.partnerActivityEnabled !== undefined
				? { partnerActivityEnabled: body.partnerActivityEnabled }
				: {}),
		};

		return HttpResponse.json(store);
	}),
];

/** Test-only helper. 시드 상태로 되돌린다. */
export const __resetNotificationSettingsStoreForTests = () => {
	store = structuredClone(mockNotificationSettings);
};
