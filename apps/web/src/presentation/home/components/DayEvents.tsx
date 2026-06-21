import { useState } from "react";
import { Badge, Card, Text } from "woosign-system";
import CalendarIcon from "@/shared/components/icon/CalendarIcon";
import EventDetailSheet from "@/presentation/events/components/EventDetailSheet";
import { formatRange } from "@/presentation/events/lib/eventDisplay";
import { CATEGORY_STYLE, WEEK_LABELS } from "@/presentation/home/lib/calendar";
import type Event from "@/domain/entities/Event";

interface Props {
	day: number;
	month: number;
	events: Event[];
}

const EmptyState = () => (
	<div
		className="flex flex-col items-center justify-center text-center"
		style={{
			borderRadius: 16,
			border: "1px dashed #D1D5DB",
			backgroundColor: "transparent",
			padding: "28px 16px",
			gap: 6,
		}}
	>
		<span style={{ opacity: 0.5 }}>
			<CalendarIcon />
		</span>
		<Text
			as="p"
			variant="muted"
			weight="medium"
			style={{
				fontSize: 13,
				color: "#6B7280",
			}}
		>
			이 날의 일정이 없어요
		</Text>
		<Text
			as="p"
			variant="muted"
			style={{
				fontSize: 12,
				color: "#9CA3AF",
			}}
		>
			새로운 일정을 추가해 보세요
		</Text>
	</div>
);

const EventCard = ({ event, onSelect }: { event: Event; onSelect: (event: Event) => void }) => {
	const style = CATEGORY_STYLE[event.category];
	return (
		<Card
			variant="default"
			fullWidth
			onPress={() => onSelect(event)}
			style={{
				position: "relative",
				overflow: "hidden",
				borderRadius: 16,
				padding: "12px 16px",
				textAlign: "left",
			}}
		>
			<span className="absolute top-0 bottom-0 left-0 w-1" style={{ backgroundColor: style.color }} />
			<div className="min-w-0 flex-1">
				<Badge variant="secondary" style={{ backgroundColor: style.softBg, color: style.color }}>
					{style.label}
				</Badge>
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
					}}
				>
					{formatRange(event)}
				</Text>
			</div>
		</Card>
	);
};

const DayEvents = ({ day, month, events }: Props) => {
	const date = new Date(2026, month - 1, day);
	const weekday = WEEK_LABELS[date.getDay()];
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	return (
		<section className="mt-2 flex flex-col">
			<div className="flex shrink-0 items-center justify-between px-1 pb-2">
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
				<div className="flex flex-col gap-2 pb-4">
					{events.map((event) => (
						<EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
					))}
				</div>
			)}

			<EventDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
		</section>
	);
};

export default DayEvents;
