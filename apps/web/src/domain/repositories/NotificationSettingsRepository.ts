import type NotificationSettings from "../entities/NotificationSettings";

/**
 * 알림 설정 부분 갱신 입력. 전달된 필드만 갱신한다.
 */
export interface UpdateNotificationSettingsInput {
	eventEnabled?: boolean;
	eventReminder?: string;
	anniversaryEnabled?: boolean;
	anniversaryReminder?: string;
	partnerActivityEnabled?: boolean;
}

export interface NotificationSettingsRepository {
	/** 내 알림 설정 조회. */
	getMine(): Promise<NotificationSettings>;
	/** 내 알림 설정 부분 갱신. */
	update(input: UpdateNotificationSettingsInput): Promise<NotificationSettings>;
}
