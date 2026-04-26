export type EventDot = "red" | "green";

export type Cell = { date: number; inMonth: boolean; key: string };

export const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export const EVENT_DOTS: Record<number, EventDot[]> = {
	3: ["green"],
	5: ["red"],
	7: ["red", "green"],
	9: ["red"],
	12: ["green"],
	14: ["red"],
	18: ["red"],
	19: ["red"],
	22: ["red", "green"],
	25: ["red"],
	26: ["red"],
	28: ["red"],
	29: ["red"],
};

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
