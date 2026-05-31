"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { disconnectCoupleUseCase } from "@/composition/couple";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 커플 연결을 해제하는 mutation hook.
 * 성공 시 캐시를 비우고 온보딩으로 이동한다(커플이 사라졌으므로).
 */
const useDisconnectCouple = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation<void, Error, void>({
		mutationFn: () => disconnectCoupleUseCase.execute(),
		onSuccess: () => {
			queryClient.clear();
			router.replace(ROUTES.ONBOARDING);
		},
	});
};

export default useDisconnectCouple;
