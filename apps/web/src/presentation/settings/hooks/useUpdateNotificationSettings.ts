"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotificationSettingsUseCase } from "@/composition/notification";
import type NotificationSettings from "@/domain/entities/NotificationSettings";
import type { UpdateNotificationSettingsInput } from "@/domain/repositories/NotificationSettingsRepository";

/**
 * 내 알림 설정을 갱신하는 mutation hook.
 */
const useUpdateNotificationSettings = () => {
	const queryClient = useQueryClient();

	return useMutation<NotificationSettings, Error, UpdateNotificationSettingsInput>({
		mutationFn: (input) => updateNotificationSettingsUseCase.execute(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
		},
	});
};

export default useUpdateNotificationSettings;
