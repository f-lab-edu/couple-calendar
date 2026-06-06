export interface NotificationSettingsResponse {
	/** 일정 알림 받기 여부. */
	eventEnabled: boolean;
	/** 일정 알림 시점(예: "하루 전"). */
	eventReminder: string;
	/** 기념일 알림 받기 여부. */
	anniversaryEnabled: boolean;
	/** 기념일 알림 시점(예: "당일"). */
	anniversaryReminder: string;
	/** 상대방 활동 알림 받기 여부. */
	partnerActivityEnabled: boolean;
}
