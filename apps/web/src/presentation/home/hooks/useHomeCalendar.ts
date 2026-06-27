"use client";

import { useMemo, useState } from "react";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import { eventBadgeLabel } from "@/presentation/events/lib/eventBadge";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import { buildMonthCells, CATEGORY_STYLE, compareCategories, todayParts } from "@/presentation/home/lib/calendar";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";

/** 달력 셀에 찍히는 점·라벨 한 개(작성자까지 반영된 표시값). */
export interface DayBadge {
	color: string;
	label: string;
}

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
	const { data: profile } = useCoupleProfile();
	const partner = profile?.partner ?? null;

	const selectedDayEvents = useMemo<Event[]>(() => {
		if (!monthlyEvents) return [];
		return monthlyEvents.filter((event) => eventStartsOnLocalDay(event, cursor.year, cursor.month, selected));
	}, [monthlyEvents, cursor.year, cursor.month, selected]);

	// 날짜별 배지. 카테고리만 묶지 않고 작성자까지 반영해서, 상대방의 '개인' 일정은
	// "개인" 대신 상대방 이름으로 보이게 한다(목록·상세와 동일 규칙: eventBadgeLabel).
	// 같은 라벨끼리는 한 개로 합치고, 카테고리 순서로 정렬한다.
	const badgesByDate = useMemo<Record<number, DayBadge[]>>(() => {
		if (!monthlyEvents) return {};
		const buckets: Record<number, Map<string, DayBadge & { category: EEventCategory }>> = {};
		for (const event of monthlyEvents) {
			const start = new Date(event.startTime);
			if (Number.isNaN(start.getTime())) continue;
			if (start.getFullYear() !== cursor.year || start.getMonth() !== cursor.month) continue;
			const day = start.getDate();
			const label = eventBadgeLabel(event, partner);
			buckets[day] ??= new Map();
			if (!buckets[day].has(label)) {
				buckets[day].set(label, { color: CATEGORY_STYLE[event.category].color, label, category: event.category });
			}
		}
		const result: Record<number, DayBadge[]> = {};
		for (const [day, map] of Object.entries(buckets)) {
			result[Number(day)] = Array.from(map.values())
				.sort((a, b) => compareCategories(a.category, b.category))
				.map(({ color, label }) => ({ color, label }));
		}
		return result;
	}, [monthlyEvents, cursor.year, cursor.month, partner]);

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
		badgesByDate,
		selectedDayEvents,
		selectDay: setSelected,
		goPrev,
		goNext,
	};
};

export default useHomeCalendar;
