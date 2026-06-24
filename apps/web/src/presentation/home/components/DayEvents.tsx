import { useState } from "react";
import { ChevronIcon } from "@/presentation/components/icons";
import EventDetailSheet from "@/presentation/events/components/EventDetailSheet";
import { formatRange } from "@/presentation/events/lib/eventDisplay";
import { CATEGORY_STYLE, WEEK_LABELS } from "@/presentation/home/lib/calendar";
import type Event from "@/domain/entities/Event";

interface Props {
	/** 1-based 연도. 선택일 요일 계산용. */
	year: number;
	day: number;
	month: number;
	events: Event[];
}

const EventRow = ({ event, onSelect }: { event: Event; onSelect: (event: Event) => void }) => {
	const style = CATEGORY_STYLE[event.category];
	const sub = `${formatRange(event)} · ${style.label}`;
	return (
		<button
			type="button"
			onClick={() => onSelect(event)}
			className="flex w-full items-center gap-3 text-left"
			style={{ padding: "14px 2px", borderTop: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
		>
			<span
				className="shrink-0"
				style={{ width: 9, height: 9, borderRadius: "50%", background: style.color }}
			/>
			<span className="min-w-0 flex-1">
				<span
					className="block truncate"
					style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}
				>
					{event.title}
				</span>
				<span
					className="bold-grotesk mt-0.5 block"
					style={{ fontSize: 11.5, fontWeight: 500, color: "var(--text-tertiary)" }}
				>
					{sub}
				</span>
			</span>
			<span className="shrink-0" style={{ color: "var(--text-tertiary)" }}>
				<ChevronIcon s={16} dir="right" />
			</span>
		</button>
	);
};

/**
 * 선택일 상세 리스트. 데이터(선택일 events)는 그대로 받고 Bold B 다크 리스트로 표시한다.
 * "N일 X요일" 헤더 + "N EVENTS" 카운트, 각 행은 카테고리 점 + 제목 + 시간·카테고리.
 */
const DayEvents = ({ year, day, month, events }: Props) => {
	const date = new Date(year, month - 1, day);
	const weekday = WEEK_LABELS[date.getDay()];
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

	return (
		<section className="mt-5 flex flex-col px-1 pb-24">
			<div className="mb-1.5 flex items-baseline justify-between">
				<div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>
					{day}일{" "}
					<span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{weekday}요일</span>
				</div>
				<div
					className="bold-grotesk"
					style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-tertiary)" }}
				>
					{events.length} EVENTS
				</div>
			</div>

			{events.length === 0 ? (
				<div style={{ padding: "20px 0", fontSize: 13, color: "var(--text-tertiary)" }}>
					일정이 없어요. + 버튼으로 추가하세요.
				</div>
			) : (
				<div>
					{events.map((event) => (
						<EventRow key={event.id} event={event} onSelect={setSelectedEvent} />
					))}
				</div>
			)}

			<EventDetailSheet event={selectedEvent} onClose={() => setSelectedEvent(null)} />
		</section>
	);
};

export default DayEvents;
