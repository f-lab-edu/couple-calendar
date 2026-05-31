"use client";

import { useQuery } from "@tanstack/react-query";
import { diContainer, SERVICES } from "@/di";
import type Event from "@/domain/entities/Event";

/**
 * React Query hook for the monthly events screen.
 *
 * @param year  four-digit year (e.g. 2026)
 * @param month 1-based month (1 = January, 12 = December)
 */
const useMonthlyEvents = (year: number, month: number) => {
	return useQuery<Event[]>({
		queryKey: ["events", year, month],
		queryFn: () => diContainer.resolve(SERVICES.GetMonthlyEventsUseCase).execute(year, month),
	});
};

export default useMonthlyEvents;
