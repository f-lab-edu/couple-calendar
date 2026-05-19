import { Badge, Card, Text } from "woosign-system";
import { WEEK_LABELS } from "@/app/home/_lib/calendar";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import ClockIcon from "@/shared/components/ClockIcon";

interface Props {
	day: number;
	month: number;
	events: Event[];
}

const CATEGORY_LABEL: Record<EEventCategory, string> = {
	DATE: "데이트",
	ANNIVERSARY: "기념일",
	INDIVIDUAL: "개인",
	OTHER: "기타",
};

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Format an ISO 8601 instant as a Korean local "HH:mm" string.
 * The browser converts to its local timezone automatically; for our KST users
 * the displayed time will read in KST.
 */
const formatTime = (iso: string): string => {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "--:--";
	return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

/**
 * Heuristic for "all day" events: starts at 00:00 local and the duration
 * covers at least the better part of a day (>= 23 hours). Works for both
 * `[00:00, 23:59:59]` and `[00:00, +1day 00:00)` conventions.
 */
const isAllDay = (event: Event): boolean => {
	const start = new Date(event.startTime);
	const end = new Date(event.endTime);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
	if (start.getHours() !== 0 || start.getMinutes() !== 0) return false;
	const durationMs = end.getTime() - start.getTime();
	return durationMs >= 23 * 60 * 60 * 1000;
};

const formatRange = (event: Event): string => {
	if (isAllDay(event)) return "종일";
	return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
};

const EmptyState = () => (
	<Card
		variant="default"
		fullWidth
		style={{
			position: "relative",
			overflow: "hidden",
			borderRadius: 16,
			padding: "12px 16px",
		}}
	>
		<div className="flex items-center gap-3">
			<div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 text-lg">📅</div>
			<div className="min-w-0 flex-1">
				<Text
					as="p"
					variant="p"
					weight="semibold"
					style={{
						color: "#111827",
					}}
				>
					이벤트가 없습니다
				</Text>
				<Text
					as="p"
					variant="muted"
					style={{
						marginTop: 4,
						fontSize: 12,
					}}
				>
					이 날의 일정을 추가해 보세요
				</Text>
			</div>
		</div>
	</Card>
);

const EventCard = ({ event }: { event: Event }) => (
	<Card
		variant="default"
		fullWidth
		style={{
			position: "relative",
			overflow: "hidden",
			borderRadius: 16,
			padding: "12px 16px",
		}}
	>
		<span className="absolute top-0 bottom-0 left-0 w-1 bg-[#c0392b]" />
		<div className="flex items-center gap-3">
			<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fde2e2] text-lg">❤️</div>
			<div className="min-w-0 flex-1">
				<Badge variant="secondary">{CATEGORY_LABEL[event.category]}</Badge>
				<Text
					as="p"
					variant="p"
					weight="semibold"
					style={{
						marginTop: 4,
						color: "#111827",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{event.title}
				</Text>
				<Text
					as="p"
					variant="muted"
					style={{
						marginTop: 4,
						fontSize: 12,
						display: "flex",
						alignItems: "center",
						gap: 4,
					}}
				>
					<ClockIcon /> {formatRange(event)}
				</Text>
			</div>
		</div>
	</Card>
);

const DayEvents = ({ day, month, events }: Props) => {
	const date = new Date(2026, month - 1, day);
	const weekday = WEEK_LABELS[date.getDay()];

	return (
		<section className="mt-2">
			<div className="flex items-center justify-between px-1 pb-2">
				<Text as="p" variant="small" weight="medium" style={{ color: "#111827" }}>
					{month}월 {day}일 {weekday}요일
				</Text>
				<Text as="p" variant="muted" style={{ fontSize: 12 }}>
					{events.length}개
				</Text>
			</div>

			{events.length === 0 ? (
				<EmptyState />
			) : (
				<div className="flex flex-col gap-2">
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			)}
		</section>
	);
};

export default DayEvents;
