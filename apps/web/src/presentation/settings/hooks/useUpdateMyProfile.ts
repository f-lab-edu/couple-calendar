"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfileUseCase } from "@/composition/user";
import type User from "@/domain/entities/User";
import type { UpdateProfileInput } from "@/domain/repositories/UserRepository";

/**
 * 내 프로필을 갱신하는 mutation hook.
 * 성공 시 설정/프로필 관련 캐시를 무효화해 화면에 반영한다.
 */
const useUpdateMyProfile = () => {
	const queryClient = useQueryClient();

	return useMutation<User, Error, UpdateProfileInput>({
		mutationFn: (input) => updateMyProfileUseCase.execute(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["coupleProfile"] });
		},
	});
};

export default useUpdateMyProfile;
