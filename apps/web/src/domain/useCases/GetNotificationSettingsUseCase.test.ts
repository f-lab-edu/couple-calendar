import { describe, expect, it, vi } from "vitest";
import type NotificationSettings from "../entities/NotificationSettings";
import type { NotificationSettingsRepository } from "../repositories/NotificationSettingsRepository";
import { GetNotificationSettingsUseCase } from "./GetNotificationSettingsUseCase";

describe("GetNotificationSettingsUseCase", () => {
	it("repository.getMine 결과를 그대로 반환한다", async () => {
		const settings = { eventEnabled: true } as NotificationSettings;
		const repository: NotificationSettingsRepository = {
			getMine: vi.fn(async () => settings),
			update: vi.fn(),
		};
		const useCase = new GetNotificationSettingsUseCase(repository);

		const result = await useCase.execute();

		expect(repository.getMine).toHaveBeenCalledTimes(1);
		expect(result).toBe(settings);
	});
});
