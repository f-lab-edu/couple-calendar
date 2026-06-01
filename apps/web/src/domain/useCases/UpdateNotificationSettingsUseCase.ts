import type NotificationSettings from "../entities/NotificationSettings";
import type {
	NotificationSettingsRepository,
	UpdateNotificationSettingsInput,
} from "../repositories/NotificationSettingsRepository";

/**
 * 내 알림 설정을 갱신한다.
 */
export class UpdateNotificationSettingsUseCase {
	constructor(private readonly repository: NotificationSettingsRepository) {}

	execute(input: UpdateNotificationSettingsInput): Promise<NotificationSettings> {
		return this.repository.update(input);
	}
}
