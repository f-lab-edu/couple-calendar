"use client";

import { useQuery } from "@tanstack/react-query";
import { getMonthlyEventsUseCase } from "@/composition/event";
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
		queryFn: () => getMonthlyEventsUseCase.execute(year, month),
	});
};

export default useMonthlyEvents;
