"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useNotificationSettings from "@/presentation/settings/hooks/useNotificationSettings";
import useUpdateNotificationSettings from "@/presentation/settings/hooks/useUpdateNotificationSettings";

interface NotificationForm {
	eventEnabled: boolean;
	eventReminder: string;
	anniversaryEnabled: boolean;
	anniversaryReminder: string;
	partnerActivityEnabled: boolean;
}

/**
 * 알림 설정 화면의 뷰모델.
 * 서버 값 로드 → 폼 초기화 → 토글/리마인더 변경 → 변경 여부(changed) 계산 →
 * 저장(성공 시 뒤로가기)까지 담당한다.
 */
const useNotificationForm = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useNotificationSettings();
	const update = useUpdateNotificationSettings();

	const [form, setForm] = useState<NotificationForm | null>(null);

	useEffect(() => {
		if (!data) return;
		setForm({
			eventEnabled: data.eventEnabled,
			eventReminder: data.eventReminder,
			anniversaryEnabled: data.anniversaryEnabled,
			anniversaryReminder: data.anniversaryReminder,
			partnerActivityEnabled: data.partnerActivityEnabled,
		});
	}, [data]);

	const changed =
		data && form
			? form.eventEnabled !== data.eventEnabled ||
				form.eventReminder !== data.eventReminder ||
				form.anniversaryEnabled !== data.anniversaryEnabled ||
				form.anniversaryReminder !== data.anniversaryReminder ||
				form.partnerActivityEnabled !== data.partnerActivityEnabled
			: false;

	const updateField = <K extends keyof NotificationForm>(key: K, value: NotificationForm[K]) => {
		setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
	};

	const save = () => {
		if (!form) return;
		update.mutate(form, { onSuccess: () => router.back() });
	};

	return {
		isLoading,
		isError,
		form,
		updateField,
		save,
		saving: update.isPending,
		saveDisabled: !changed || update.isPending,
		saveError: update.isError ? (update.error?.message ?? "저장에 실패했어요. 다시 시도해 주세요.") : undefined,
	};
};

export default useNotificationForm;
