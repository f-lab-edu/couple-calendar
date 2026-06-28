"use client";

import { useMemo, useState } from "react";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import type User from "@/domain/entities/User";
import { eventBadgeLabel, type MemberLike } from "@/presentation/events/lib/eventBadge";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import {
	type Cell,
	buildMonthCells,
	CATEGORY_STYLE,
	compareCategories,
	endOfLocalDay,
	eventCoversLocalDay,
	startOfLocalDay,
	todayParts,
} from "@/presentation/home/lib/calendar";
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

/** 0-based 월 기준 delta(±1)만큼 이동한 연/월. */
const shiftMonth = (year: number, month: number, delta: number): { year: number; month: number } => {
	const m = month + delta;
	if (m < 0) return { year: year - 1, month: 11 };
	if (m > 11) return { year: year + 1, month: 0 };
	return { year, month: m };
};

/**
 * 한 달치 이벤트를 날짜별 배지로 묶는다. 여러 날 일정은 시작일뿐 아니라 그 달에 걸친
 * 모든 날에 배지를 찍는다(월 경계를 넘는 일정은 이 달에 속한 구간만 클램프). 카테고리만
 * 묶지 않고 작성자까지 반영해서 '개인' 일정은 작성자 이름으로 보이게 한다(목록·상세와 동일 규칙).
 * 같은 라벨끼리는 하루 안에서 한 개로 합치고, 카테고리 순서로 정렬한다.
 */
function buildBadgesByDate(
	events: Event[],
	year: number,
	month0: number,
	members: MemberLike[],
): Record<number, DayBadge[]> {
	const buckets: Record<number, Map<string, DayBadge & { category: EEventCategory }>> = {};
	const monthStart = startOfLocalDay(year, month0, 1);
	const lastDay = new Date(year, month0 + 1, 0).getDate();
	const monthEnd = endOfLocalDay(year, month0, lastDay);

	for (const event of events) {
		const start = new Date(event.startTime);
		const end = new Date(event.endTime);
		if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) continue;
		// 이 달과 겹치지 않으면 건너뛴다.
		if (end.getTime() < monthStart || start.getTime() > monthEnd) continue;
		// 이 달에 속한 구간으로 클램프: 시작이 이전 달이면 1일부터, 끝이 다음 달이면 말일까지.
		const from = start.getTime() < monthStart ? 1 : start.getDate();
		const to = end.getTime() > monthEnd ? lastDay : end.getDate();
		const label = eventBadgeLabel(event, members);
		for (let day = from; day <= to; day++) {
			buckets[day] ??= new Map();
			if (!buckets[day].has(label)) {
				buckets[day].set(label, { color: CATEGORY_STYLE[event.category].color, label, category: event.category });
			}
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
	// 커플 구성원(나·상대). '개인' 일정 배지에서 작성자 이름을 찾는 데 쓴다.
	const members = useMemo<MemberLike[]>(
		() => [profile?.me, profile?.partner].filter((u): u is User => u != null),
		[profile?.me, profile?.partner],
	);

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
			badgesByDate: buildBadgesByDate(events ?? [], y, m, members),
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
		members,
	]);

	const selectedDayEvents = useMemo<Event[]>(() => {
		if (!curEvents) return [];
		return curEvents.filter((event) =>
			eventCoversLocalDay(event.startTime, event.endTime, cursor.year, cursor.month, selected),
		);
	}, [curEvents, cursor.year, cursor.month, selected]);

	const goPrev = () => setCursor((c) => shiftMonth(c.year, c.month, -1));
	const goNext = () => setCursor((c) => shiftMonth(c.year, c.month, 1));
	// 오늘이 있는 달로 즉시 복귀하고 오늘을 선택한다(먼 달로 이동했을 때 한 번에 돌아오기).
	const goToday = () => {
		setCursor({ year: today.year, month: today.month });
		setSelected(today.day);
	};
	const isTodayMonth = cursor.year === today.year && cursor.month === today.month;

	return {
		year: cursor.year,
		month: cursor.month,
		selected,
		months,
		selectedDayEvents,
		isTodayMonth,
		selectDay: setSelected,
		goPrev,
		goNext,
		goToday,
	};
};

export default useHomeCalendar;
