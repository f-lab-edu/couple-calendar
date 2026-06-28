"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllEventsUseCase } from "@/composition/event";
import type Event from "@/domain/entities/Event";

/**
 * 커플의 전체 일정을 불러온다(검색용). 한 번 받아두고 키 입력마다 메모리에서 필터하므로
 * 검색어가 바뀌어도 재조회하지 않는다(staleTime 으로 캐시 유지).
 */
const useAllEvents = (enabled: boolean) =>
	useQuery<Event[]>({
		queryKey: ["events", "all"],
		queryFn: () => getAllEventsUseCase.execute(),
		enabled,
		staleTime: 60_000,
	});

export default useAllEvents;
