"use client";

import { useMemo, useState } from "react";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import { buildMonthCells, compareCategories, todayParts } from "@/presentation/home/lib/calendar";

const eventStartsOnLocalDay = (event: Event, year: number, month0Based: number, day: number): boolean => {
	const start = new Date(event.startTime);
	if (Number.isNaN(start.getTime())) return false;
	return start.getFullYear() === year && start.getMonth() === month0Based && start.getDate() === day;
};

/**
 * 홈 달력의 뷰 상태(현재 연/월 커서, 선택 날짜)와 그로부터 파생되는 데이터
 * (달력 셀, 날짜별 카테고리 점, 선택일 이벤트)를 한곳에서 관리하는 뷰모델 훅.
 *
 * 화면(HomePage)은 이 훅이 돌려주는 값만 그리면 되고,
 * "오늘로 시작 / 월 이동 / 이벤트를 날짜별로 묶기" 같은 계산은 모두 여기서 책임진다.
 */
const useHomeCalendar = () => {
	// 최초 진입 시 오늘 날짜의 달력을 보여주고, 오늘을 선택 상태로 둔다.
	const today = useMemo(todayParts, []);
	const [cursor, setCursor] = useState({ year: today.year, month: today.month });
	const [selected, setSelected] = useState(today.day);
	const [navigationDirection, setNavigationDirection] = useState<"prev" | "next" | null>(null);

	const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month), [cursor]);

	// cursor.month는 0-based(UI 규약), 훅은 1-based 월을 기대한다.
	const { data: monthlyEvents } = useMonthlyEvents(cursor.year, cursor.month + 1);

	const selectedDayEvents = useMemo<Event[]>(() => {
		if (!monthlyEvents) return [];
		return monthlyEvents.filter((event) => eventStartsOnLocalDay(event, cursor.year, cursor.month, selected));
	}, [monthlyEvents, cursor.year, cursor.month, selected]);

	const categoriesByDate = useMemo<Record<number, EEventCategory[]>>(() => {
		if (!monthlyEvents) return {};
		const buckets: Record<number, Set<EEventCategory>> = {};
		for (const event of monthlyEvents) {
			const start = new Date(event.startTime);
			if (Number.isNaN(start.getTime())) continue;
			if (start.getFullYear() !== cursor.year || start.getMonth() !== cursor.month) continue;
			const day = start.getDate();
			buckets[day] ??= new Set<EEventCategory>();
			buckets[day].add(event.category);
		}
		const result: Record<number, EEventCategory[]> = {};
		for (const [day, set] of Object.entries(buckets)) {
			result[Number(day)] = Array.from(set).sort(compareCategories);
		}
		return result;
	}, [monthlyEvents, cursor.year, cursor.month]);

	const goPrev = () => {
		setNavigationDirection("prev");
		setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
	};
	const goNext = () => {
		setNavigationDirection("next");
		setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
	};

	return {
		year: cursor.year,
		month: cursor.month,
		selected,
		navigationDirection,
		cells,
		categoriesByDate,
		selectedDayEvents,
		selectDay: setSelected,
		goPrev,
		goNext,
	};
};

export default useHomeCalendar;
