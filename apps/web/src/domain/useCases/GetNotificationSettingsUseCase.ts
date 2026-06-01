import type NotificationSettings from "../entities/NotificationSettings";
import type { NotificationSettingsRepository } from "../repositories/NotificationSettingsRepository";

/**
 * 내 알림 설정을 조회한다.
 */
export class GetNotificationSettingsUseCase {
	constructor(private readonly repository: NotificationSettingsRepository) {}

	execute(): Promise<NotificationSettings> {
		return this.repository.getMine();
	}
}
