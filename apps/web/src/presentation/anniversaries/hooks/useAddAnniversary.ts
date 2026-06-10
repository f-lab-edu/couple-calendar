"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAnniversaryUseCase } from "@/composition/anniversary";
import type Anniversary from "@/domain/entities/Anniversary";

/**
 * React Query mutation hook for creating a custom anniversary.
 * Invalidates the anniversaries cache on success so lists/D-day refresh.
 */
const useAddAnniversary = () => {
	const queryClient = useQueryClient();

	return useMutation<Anniversary, Error, Anniversary>({
		mutationFn: (anniversary) => addAnniversaryUseCase.execute(anniversary),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anniversaries"] });
		},
	});
};

export default useAddAnniversary;
