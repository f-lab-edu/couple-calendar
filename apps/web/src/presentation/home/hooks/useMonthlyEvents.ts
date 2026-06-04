"use client";

import { useQuery } from "@tanstack/react-query";
import { EventDataSource } from "@/data/apis/EventDataSource";
import { EventRepositoryImpl } from "@/data/repositories/EventRepositoryImpl";
import type Event from "@/domain/entities/Event";
import { GetMonthlyEventsUseCase } from "@/domain/useCases/GetMonthlyEventsUseCase";

// Module-level singletons: cheap, stateless, safe to share across hook calls.
const eventDataSource = new EventDataSource();
const eventRepository = new EventRepositoryImpl(eventDataSource);
const getMonthlyEventsUseCase = new GetMonthlyEventsUseCase(eventRepository);

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
