/**
 * NotificationSettings domain entity.
 *
 * 사용자의 알림 환경설정. 순수 TypeScript 모델.
 */
class NotificationSettings {
	readonly eventEnabled: boolean;
	readonly eventReminder: string;
	readonly anniversaryEnabled: boolean;
	readonly anniversaryReminder: string;
	readonly partnerActivityEnabled: boolean;

	constructor(
		eventEnabled: boolean,
		eventReminder: string,
		anniversaryEnabled: boolean,
		anniversaryReminder: string,
		partnerActivityEnabled: boolean,
	) {
		this.eventEnabled = eventEnabled;
		this.eventReminder = eventReminder;
		this.anniversaryEnabled = anniversaryEnabled;
		this.anniversaryReminder = anniversaryReminder;
		this.partnerActivityEnabled = partnerActivityEnabled;
	}
}

export default NotificationSettings;
