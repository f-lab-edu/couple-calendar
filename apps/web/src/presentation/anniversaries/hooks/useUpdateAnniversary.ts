"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnniversaryUseCase } from "@/composition/anniversary";
import type Anniversary from "@/domain/entities/Anniversary";
import type { UpdateAnniversaryInput } from "@/domain/repositories/AnniversaryRepository";

interface UpdateAnniversaryVariables {
	id: string;
	input: UpdateAnniversaryInput;
}

/**
 * React Query mutation hook for updating a custom anniversary.
 * Invalidates the anniversaries cache on success so lists/D-day refresh.
 */
const useUpdateAnniversary = () => {
	const queryClient = useQueryClient();

	return useMutation<Anniversary, Error, UpdateAnniversaryVariables>({
		mutationFn: ({ id, input }) => updateAnniversaryUseCase.execute(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["anniversaries"] });
		},
	});
};

export default useUpdateAnniversary;
