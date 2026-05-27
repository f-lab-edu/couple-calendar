import type { EEventCategory } from "@/domain/entities/Event";

/**
 * Visual identity per event category. Used by the calendar grid dots and the
 * day-event card treatment so users can tell categories apart at a glance.
 */
export interface CategoryStyle {
	/** Solid hex used for dots and the card's left accent bar. */
	color: string;
	/** Soft background used as the badge background. */
	softBg: string;
	/** Korean label shown in the badge. */
	label: string;
}

export const CATEGORY_STYLE: Record<EEventCategory, CategoryStyle> = {
	ANNIVERSARY: { color: "#f59e0b", softBg: "#fef3c7", label: "기념일" },
	DATE: { color: "#e74c3c", softBg: "#fde2e2", label: "데이트" },
	INDIVIDUAL: { color: "#3b82f6", softBg: "#dbeafe", label: "개인" },
	OTHER: { color: "#94a3b8", softBg: "#e2e8f0", label: "기타" },
};

/**
 * Stable sort order for stacked dots — keeps anniversary first so the most
 * meaningful signal lands at the leftmost position.
 */
const CATEGORY_ORDER: Record<EEventCategory, number> = {
	ANNIVERSARY: 0,
	DATE: 1,
	INDIVIDUAL: 2,
	OTHER: 3,
};

export const compareCategories = (a: EEventCategory, b: EEventCategory): number =>
	CATEGORY_ORDER[a] - CATEGORY_ORDER[b];

export type Cell = { date: number; inMonth: boolean; key: string };

export const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function buildMonthCells(year: number, month: number): Cell[] {
	const firstDay = new Date(year, month, 1);
	const startWeekday = firstDay.getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrev = new Date(year, month, 0).getDate();

	const cells: Cell[] = [];
	for (let i = startWeekday - 1; i >= 0; i--) {
		const d = daysInPrev - i;
		cells.push({ date: d, inMonth: false, key: `p-${d}` });
	}
	for (let d = 1; d <= daysInMonth; d++) {
		cells.push({ date: d, inMonth: true, key: `c-${d}` });
	}
	let next = 1;
	while (cells.length < 42) {
		cells.push({ date: next, inMonth: false, key: `n-${next}` });
		next++;
	}

	return cells;
}
