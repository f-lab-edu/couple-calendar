import { describe, expect, it, vi } from "vitest";
import type NotificationSettings from "../entities/NotificationSettings";
import type {
	NotificationSettingsRepository,
	UpdateNotificationSettingsInput,
} from "../repositories/NotificationSettingsRepository";
import { UpdateNotificationSettingsUseCase } from "./UpdateNotificationSettingsUseCase";

describe("UpdateNotificationSettingsUseCase", () => {
	it("입력을 그대로 repository.update에 위임하고 결과를 반환한다", async () => {
		const updated = { eventEnabled: false } as NotificationSettings;
		const repository: NotificationSettingsRepository = {
			getMine: vi.fn(),
			update: vi.fn(async () => updated),
		};
		const useCase = new UpdateNotificationSettingsUseCase(repository);
		const input: UpdateNotificationSettingsInput = { eventEnabled: false };

		const result = await useCase.execute(input);

		expect(repository.update).toHaveBeenCalledWith(input);
		expect(result).toBe(updated);
	});
});
