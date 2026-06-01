import { NotificationSettingsDataSource } from "@/data/apis/NotificationSettingsDataSource";
import { parseNotificationSettings } from "@/data/parsers/notificationSettingsParser";
import type NotificationSettings from "@/domain/entities/NotificationSettings";
import type {
	NotificationSettingsRepository,
	UpdateNotificationSettingsInput,
} from "@/domain/repositories/NotificationSettingsRepository";

export class NotificationSettingsRepositoryImpl implements NotificationSettingsRepository {
	constructor(
		private readonly dataSource: NotificationSettingsDataSource = new NotificationSettingsDataSource(),
	) {}

	async getMine(): Promise<NotificationSettings> {
		return parseNotificationSettings(await this.dataSource.getMine());
	}

	async update(input: UpdateNotificationSettingsInput): Promise<NotificationSettings> {
		return parseNotificationSettings(await this.dataSource.update(input));
	}
}
