"use client";

import { useMutation } from "@tanstack/react-query";
import { connectCoupleUseCase } from "@/composition/couple";
import type Couple from "@/domain/entities/Couple";

/**
 * React Query mutation hook for connecting with a partner via invite code.
 */
const useConnectCouple = () => {
	return useMutation<Couple, Error, string>({
		mutationFn: (inviteCode: string) => connectCoupleUseCase.execute(inviteCode),
	});
};

export default useConnectCouple;
