"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCoupleStartDateUseCase } from "@/composition/couple";
import type Couple from "@/domain/entities/Couple";

/**
 * 커플 시작일을 수정하는 mutation hook.
 * 성공 시 설정 프로필 캐시를 무효화해 D-day가 갱신되게 한다.
 */
const useUpdateCoupleStartDate = () => {
	const queryClient = useQueryClient();

	return useMutation<Couple, Error, string>({
		mutationFn: (startDate) => updateCoupleStartDateUseCase.execute(startDate),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["coupleProfile"] });
		},
	});
};

export default useUpdateCoupleStartDate;
