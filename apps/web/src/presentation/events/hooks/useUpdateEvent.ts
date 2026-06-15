"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventUseCase } from "@/composition/event";
import type Event from "@/domain/entities/Event";
import type { UpdateEventInput } from "@/domain/repositories/EventRepository";

interface UpdateEventVariables {
	id: string;
	input: UpdateEventInput;
}

/**
 * React Query mutation hook for updating a shared calendar event.
 * Invalidates the monthly events cache on success so the calendar refreshes.
 */
const useUpdateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation<Event, Error, UpdateEventVariables>({
		mutationFn: ({ id, input }) => updateEventUseCase.execute(id, input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

export default useUpdateEvent;
