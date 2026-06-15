import type Event from "@/domain/entities/Event";

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/**
 * Format an ISO 8601 instant as a Korean local "HH:mm" string.
 * The browser converts to its local timezone automatically; for our KST users
 * the displayed time will read in KST.
 */
export const formatTime = (iso: string): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "--:--";
	return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

/**
 * Heuristic for "all day" events: starts at 00:00 local and the duration
 * covers at least the better part of a day (>= 23 hours). Works for both
 * `[00:00, 23:59:59]` and `[00:00, +1day 00:00)` conventions.
 */
export const isAllDay = (event: Event): boolean => {
	const start = new Date(event.startTime);
	const end = new Date(event.endTime);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
	if (start.getHours() !== 0 || start.getMinutes() !== 0) return false;
	const durationMs = end.getTime() - start.getTime();
	return durationMs >= 23 * 60 * 60 * 1000;
};

/** Compact time range used on the day-event cards, e.g. "13:00 - 14:30" or "종일". */
export const formatRange = (event: Event): string => {
	if (isAllDay(event)) return "종일";
	return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
};

/** Full Korean date with weekday, e.g. "2026년 6월 1일 (월)". */
export const formatFullDate = (iso: string): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEK_LABELS[d.getDay()]})`;
};
