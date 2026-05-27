"use client";

import { useMutation } from "@tanstack/react-query";
import { diContainer, SERVICES } from "@/di";
import type Couple from "@/domain/entities/Couple";

/**
 * React Query mutation hook for connecting with a partner via invite code.
 * Resolves the use case per mutation call (transient → fresh instance each time).
 */
const useConnectCouple = () => {
	return useMutation<Couple, Error, string>({
		mutationFn: (inviteCode: string) =>
			diContainer.resolve(SERVICES.ConnectCoupleUseCase).execute(inviteCode),
	});
};

export default useConnectCouple;
