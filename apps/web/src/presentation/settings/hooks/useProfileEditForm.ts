"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useUpdateMyProfile from "@/presentation/settings/hooks/useUpdateMyProfile";

interface ProfileForm {
	name: string;
	nickname: string;
	birthday: string;
	bio: string;
}

/**
 * 내 프로필 수정 화면의 뷰모델.
 * 서버 값 로드 → 폼 초기화 → 필드 갱신 → 저장(성공 시 뒤로가기)까지 담당하고,
 * 화면은 돌려받은 값/콜백만 바인딩한다.
 */
const useProfileEditForm = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const update = useUpdateMyProfile();
	const me = data?.me;

	const [form, setForm] = useState<ProfileForm | null>(null);

	useEffect(() => {
		if (!me) return;
		setForm({
			name: me.name,
			nickname: me.nickname,
			birthday: me.birthday ?? "",
			bio: me.bio ?? "",
		});
	}, [me]);

	const updateField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
		setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
	};

	const save = () => {
		if (!form) return;
		update.mutate(
			{
				name: form.name,
				nickname: form.nickname,
				birthday: form.birthday || null,
				bio: form.bio || null,
			},
			{ onSuccess: () => router.back() },
		);
	};

	return {
		isLoading,
		isError,
		form,
		updateField,
		today: new Date().toISOString().slice(0, 10),
		save,
		saving: update.isPending,
		saveDisabled: !form || update.isPending,
		saveError: update.isError ? (update.error?.message ?? "저장에 실패했어요. 다시 시도해 주세요.") : undefined,
		cancel: () => router.back(),
	};
};

export default useProfileEditForm;
