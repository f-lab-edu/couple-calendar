"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { diContainer, SERVICES } from "@/di";
import type Event from "@/domain/entities/Event";
import type { CreateEventInput } from "@/domain/repositories/EventRepository";

/**
 * React Query mutation hook for creating a shared calendar event.
 * Resolves the use case per mutation call (transient → fresh instance each time)
 * and invalidates the monthly events cache so the calendar refreshes.
 */
const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation<Event, Error, CreateEventInput>({
		mutationFn: (input) => diContainer.resolve(SERVICES.CreateEventUseCase).execute(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["events"] });
		},
	});
};

export default useCreateEvent;
