/**
 * PATCH /api/users/me/notifications 요청 바디. 전달된 필드만 갱신.
 */
export interface UpdateNotificationSettingsRequest {
	eventEnabled?: boolean;
	eventReminder?: string;
	anniversaryEnabled?: boolean;
	anniversaryReminder?: string;
	partnerActivityEnabled?: boolean;
}
