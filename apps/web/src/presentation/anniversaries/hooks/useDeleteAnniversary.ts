"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAnniversaryUseCase } from "@/composition/anniversary";

/**
 * React Query mutation hook for deleting a custom anniversary.
 * Invalidates the anniversaries cache on success so lists/D-day refresh.
 */
const useDeleteAnniversary = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (id) => deleteAnniversaryUseCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anniversaries"] });
		},
	});
};

export default useDeleteAnniversary;
