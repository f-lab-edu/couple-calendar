"use client";

import { useQuery } from "@tanstack/react-query";
import { getNotificationSettingsUseCase } from "@/composition/notification";
import type NotificationSettings from "@/domain/entities/NotificationSettings";

/**
 * 내 알림 설정을 로드한다.
 */
const useNotificationSettings = () =>
	useQuery<NotificationSettings>({
		queryKey: ["notificationSettings"],
		queryFn: () => getNotificationSettingsUseCase.execute(),
	});

export default useNotificationSettings;
