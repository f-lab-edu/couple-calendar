"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventUseCase } from "@/composition/event";
import type Event from "@/domain/entities/Event";
import type { CreateEventInput } from "@/domain/repositories/EventRepository";

/**
 * React Query mutation hook for creating a shared calendar event.
 * Invalidates the monthly events cache on success so the calendar refreshes.
 */
const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation<Event, Error, CreateEventInput>({
		mutationFn: (input) => createEventUseCase.execute(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

export default useCreateEvent;
