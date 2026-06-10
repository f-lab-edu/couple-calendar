"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEventUseCase } from "@/composition/event";

/**
 * React Query mutation hook for deleting a shared calendar event.
 * Invalidates the monthly events cache on success so the calendar refreshes.
 */
const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (id) => deleteEventUseCase.execute(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

export default useDeleteEvent;
