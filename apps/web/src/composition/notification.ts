import { NotificationSettingsDataSource } from "@/data/apis/NotificationSettingsDataSource";
import { NotificationSettingsRepositoryImpl } from "@/data/repositories/NotificationSettingsRepositoryImpl";
import { GetNotificationSettingsUseCase } from "@/domain/useCases/GetNotificationSettingsUseCase";
import { UpdateNotificationSettingsUseCase } from "@/domain/useCases/UpdateNotificationSettingsUseCase";

/**
 * Notification 도메인 조립 루트(composition root).
 *
 * 모듈 스코프 인스턴스 = ESM 캐싱으로 공유되는 사실상의 싱글턴.
 */
const dataSource = new NotificationSettingsDataSource();
const repository = new NotificationSettingsRepositoryImpl(dataSource);

export const getNotificationSettingsUseCase = new GetNotificationSettingsUseCase(repository);
export const updateNotificationSettingsUseCase = new UpdateNotificationSettingsUseCase(repository);
