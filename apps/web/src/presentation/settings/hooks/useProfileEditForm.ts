"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type User from "@/domain/entities/User";
import useUpdateMyProfile from "@/presentation/settings/hooks/useUpdateMyProfile";

interface ProfileForm {
	name: string;
	nickname: string;
	birthday: string;
	bio: string;
}

const EMPTY_FORM: ProfileForm = { name: "", nickname: "", birthday: "", bio: "" };

const toForm = (me: User): ProfileForm => ({
	name: me.name,
	nickname: me.nickname,
	birthday: me.birthday ?? "",
	bio: me.bio ?? "",
});

/**
 * 내 프로필 수정 폼의 뷰모델 (react-hook-form 기반).
 *
 * - `values`: 서버에서 온 me가 로드/변경되면 RHF가 폼을 reactive하게 재동기화한다.
 *   (직접 useEffect로 setState 동기화할 필요가 없다)
 * - `keepDirtyValues`: 재동기화(refetch 등) 시 사용자가 이미 고친 필드는 보존한다.
 * - `isDirty`: 변경 여부를 RHF가 추적 → 저장 버튼 활성/비활성에 그대로 사용.
 */
const useProfileEditForm = (me: User | undefined) => {
	const router = useRouter();
	const update = useUpdateMyProfile();

	const {
		register,
		handleSubmit,
		formState: { isDirty },
	} = useForm<ProfileForm>({
		values: me ? toForm(me) : EMPTY_FORM,
		resetOptions: { keepDirtyValues: true },
	});

	const onSubmit = (form: ProfileForm) =>
		update.mutate(
			{
				name: form.name,
				nickname: form.nickname,
				birthday: form.birthday || null,
				bio: form.bio || null,
			},
			{ onSuccess: () => router.back() },
		);

	return {
		register,
		submit: handleSubmit(onSubmit),
		today: new Date().toISOString().slice(0, 10),
		saving: update.isPending,
		saveDisabled: !isDirty || update.isPending,
		saveError: update.isError ? (update.error?.message ?? "저장에 실패했어요. 다시 시도해 주세요.") : undefined,
		cancel: () => router.back(),
	};
};

export default useProfileEditForm;
