"use client";

import { useMemo, useState } from "react";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import { eventBadgeLabel } from "@/presentation/events/lib/eventBadge";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import { type Cell, buildMonthCells, CATEGORY_STYLE, compareCategories, todayParts } from "@/presentation/home/lib/calendar";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";

/** 달력 셀에 찍히는 점·라벨 한 개(작성자까지 반영된 표시값). */
export interface DayBadge {
	color: string;
	label: string;
}

/** 캘린더 한 달치 뷰 데이터(카루셀의 한 패널). */
export interface MonthPanel {
	/** `${year}-${month}` — React key / 식별자. */
	key: string;
	year: number;
	/** 0-based 월(UI 규약). */
	month: number;
	cells: Cell[];
	badgesByDate: Record<number, DayBadge[]>;
}

interface PartnerLike {
	id: string;
	nickname: string;
	name: string;
}

const eventStartsOnLocalDay = (event: Event, year: number, month0Based: number, day: number): boolean => {
	const start = new Date(event.startTime);
	if (Number.isNaN(start.getTime())) return false;
	return start.getFullYear() === year && start.getMonth() === month0Based && start.getDate() === day;
};

/** 0-based 월 기준 delta(±1)만큼 이동한 연/월. */
const shiftMonth = (year: number, month: number, delta: number): { year: number; month: number } => {
	const m = month + delta;
	if (m < 0) return { year: year - 1, month: 11 };
	if (m > 11) return { year: year + 1, month: 0 };
	return { year, month: m };
};

/**
 * 한 달치 이벤트를 날짜별 배지로 묶는다. 카테고리만 묶지 않고 작성자까지 반영해서,
 * 상대방의 '개인' 일정은 "개인" 대신 상대방 이름으로 보이게 한다(목록·상세와 동일 규칙).
 * 같은 라벨끼리는 한 개로 합치고, 카테고리 순서로 정렬한다.
 */
function buildBadgesByDate(
	events: Event[],
	year: number,
	month0: number,
	partner: PartnerLike | null,
): Record<number, DayBadge[]> {
	const buckets: Record<number, Map<string, DayBadge & { category: EEventCategory }>> = {};
	for (const event of events) {
		const start = new Date(event.startTime);
		if (Number.isNaN(start.getTime())) continue;
		if (start.getFullYear() !== year || start.getMonth() !== month0) continue;
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
}

/**
 * 홈 달력의 뷰 상태(현재 연/월 커서, 선택 날짜)와 파생 데이터를 관리하는 뷰모델 훅.
 *
 * 좌우 드래그 전환이 인접 달을 "연속으로" 보여줄 수 있도록, 현재 달뿐 아니라
 * 이전·다음 달의 패널(셀 + 배지)까지 함께 만들어 [prev, cur, next] 3개를 돌려준다.
 */
const useHomeCalendar = () => {
	// 최초 진입 시 오늘 날짜의 달력을 보여주고, 오늘을 선택 상태로 둔다.
	const today = useMemo(todayParts, []);
	const [cursor, setCursor] = useState({ year: today.year, month: today.month });
	const [selected, setSelected] = useState(today.day);

	const { data: profile } = useCoupleProfile();
	const partner = profile?.partner ?? null;

	const prev = shiftMonth(cursor.year, cursor.month, -1);
	const next = shiftMonth(cursor.year, cursor.month, 1);

	// 세 달치 이벤트를 미리 가져온다(TanStack Query 캐시 — 이동 시 이미 따뜻하다).
	// month는 0-based이므로 훅에는 +1 해서 1-based로 넘긴다.
	const { data: prevEvents } = useMonthlyEvents(prev.year, prev.month + 1);
	const { data: curEvents } = useMonthlyEvents(cursor.year, cursor.month + 1);
	const { data: nextEvents } = useMonthlyEvents(next.year, next.month + 1);

	const months = useMemo<[MonthPanel, MonthPanel, MonthPanel]>(() => {
		const panel = (y: number, m: number, events: Event[] | undefined): MonthPanel => ({
			key: `${y}-${m}`,
			year: y,
			month: m,
			cells: buildMonthCells(y, m),
			badgesByDate: buildBadgesByDate(events ?? [], y, m, partner),
		});
		return [
			panel(prev.year, prev.month, prevEvents),
			panel(cursor.year, cursor.month, curEvents),
			panel(next.year, next.month, nextEvents),
		];
	}, [
		prev.year,
		prev.month,
		cursor.year,
		cursor.month,
		next.year,
		next.month,
		prevEvents,
		curEvents,
		nextEvents,
		partner,
	]);

	const selectedDayEvents = useMemo<Event[]>(() => {
		if (!curEvents) return [];
		return curEvents.filter((event) => eventStartsOnLocalDay(event, cursor.year, cursor.month, selected));
	}, [curEvents, cursor.year, cursor.month, selected]);

	const goPrev = () => setCursor((c) => shiftMonth(c.year, c.month, -1));
	const goNext = () => setCursor((c) => shiftMonth(c.year, c.month, 1));

	return {
		year: cursor.year,
		month: cursor.month,
		selected,
		months,
		selectedDayEvents,
		selectDay: setSelected,
		goPrev,
		goNext,
	};
};

export default useHomeCalendar;
