"use client";

import { ROUTES } from "@/shared/constants/routes";
import Link from "next/link";
import { useMemo, useState } from "react";

type EventDot = "red" | "green";

const WEEK_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const EVENT_DOTS: Record<number, EventDot[]> = {
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

type Cell = { date: number; inMonth: boolean; key: string };

function buildMonthCells(year: number, month: number): Cell[] {
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

export default function HomePage() {
	const [view, setView] = useState<"month" | "week" | "list">("month");
	const [cursor, setCursor] = useState({ year: 2026, month: 3 }); // 0-indexed: 3 = April
	const [selected, setSelected] = useState(25);

	const cells = useMemo(
		() => buildMonthCells(cursor.year, cursor.month),
		[cursor],
	);

	const goPrev = () => {
		setCursor((c) =>
			c.month === 0
				? { year: c.year - 1, month: 11 }
				: { year: c.year, month: c.month - 1 },
		);
	};
	const goNext = () => {
		setCursor((c) =>
			c.month === 11
				? { year: c.year + 1, month: 0 }
				: { year: c.year, month: c.month + 1 },
		);
	};

	return (
		<main className="mx-auto flex min-h-screen max-w-[420px] flex-col gap-4 bg-[#f6f5f0] px-4 py-5 text-[15px] text-neutral-800">
			<DdayCard />

			<section className="flex items-center justify-between">
				<ViewToggle value={view} onChange={setView} />
				<MonthNav
					year={cursor.year}
					month={cursor.month}
					onPrev={goPrev}
					onNext={goNext}
				/>
			</section>

			<CalendarGrid
				cells={cells}
				selected={selected}
				onSelect={setSelected}
			/>

			<DayEvents day={selected} month={cursor.month + 1} />

			<button
				type="button"
				aria-label="새 이벤트 추가"
				className="fixed bottom-6 right-[max(24px,calc(50%-186px))] flex h-14 w-14 items-center justify-center rounded-full bg-[#e85d2f] text-3xl text-white shadow-lg shadow-orange-500/30 transition active:scale-95"
			>
				<span className="-mt-0.5">+</span>
			</button>
		</main>
	);
}

function DdayCard() {
	return (
		<section className="relative overflow-hidden rounded-3xl bg-[#1f3a2e] px-5 py-5 text-white shadow-sm">
			<div className="-right-8 -top-10 pointer-events-none absolute h-40 w-40 rounded-full border border-white/10" />
			<div className="-right-16 -bottom-16 pointer-events-none absolute h-44 w-44 rounded-full border border-white/10" />

			<Link href={ROUTES.SETTINGS} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/15">
				<GearIcon />
			</Link>

			<div className="relative flex items-center gap-3">
				<div className="flex -space-x-2">
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e7d6] text-xl ring-2 ring-[#1f3a2e]">
						🌷
					</div>
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e1cf] text-xl ring-2 ring-[#1f3a2e]">
						🌿
					</div>
				</div>
				<p className="text-sm text-white/80">
					지수 <span className="text-[#ff7b8a]">♥</span> 민준
				</p>
			</div>

			<div className="relative mt-3">
				<p className="font-semibold text-4xl tracking-tight">D+412</p>
				<p className="mt-1 text-white/70 text-xs">2025. 03. 09 부터 함께</p>
			</div>
		</section>
	);
}

function ViewToggle({
	value,
	onChange,
}: {
	value: "month" | "week" | "list";
	onChange: (v: "month" | "week" | "list") => void;
}) {
	const items: { key: "month" | "week" | "list"; label: string }[] = [
		{ key: "month", label: "월" },
		{ key: "week", label: "주" },
		{ key: "list", label: "목록" },
	];
	return (
		<div className="flex items-center rounded-full bg-neutral-200/70 p-1 text-sm">
			{items.map((it) => {
				const active = value === it.key;
				return (
					<button
						key={it.key}
						type="button"
						onClick={() => onChange(it.key)}
						className={`rounded-full px-3 py-1 transition ${
							active
								? "bg-white font-medium text-neutral-900 shadow-sm"
								: "text-neutral-500"
						}`}
					>
						{it.label}
					</button>
				);
			})}
		</div>
	);
}

function MonthNav({
	year,
	month,
	onPrev,
	onNext,
}: {
	year: number;
	month: number;
	onPrev: () => void;
	onNext: () => void;
}) {
	return (
		<div className="flex items-center gap-2 text-sm">
			<button
				type="button"
				aria-label="이전 달"
				onClick={onPrev}
				className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-neutral-900"
			>
				‹
			</button>
			<span className="font-medium text-neutral-900 tabular-nums">
				{year}. {month + 1}월
			</span>
			<button
				type="button"
				aria-label="다음 달"
				onClick={onNext}
				className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-neutral-900"
			>
				›
			</button>
		</div>
	);
}

function CalendarGrid({
	cells,
	selected,
	onSelect,
}: {
	cells: Cell[];
	selected: number;
	onSelect: (d: number) => void;
}) {
	return (
		<section>
			<div className="grid grid-cols-7 pb-2 text-center text-xs">
				{WEEK_LABELS.map((w, i) => (
					<span
						key={w}
						className={
							i === 0
								? "text-[#e74c3c]"
								: i === 6
									? "text-[#3b82f6]"
									: "text-neutral-500"
						}
					>
						{w}
					</span>
				))}
			</div>

			<div className="grid grid-cols-7 gap-y-2">
				{cells.map((cell, i) => {
					const weekday = i % 7;
					const dots = cell.inMonth ? EVENT_DOTS[cell.date] : undefined;
					const isSelected = cell.inMonth && cell.date === selected;
					const baseColor = !cell.inMonth
						? "text-neutral-300"
						: weekday === 0
							? "text-[#e74c3c]"
							: weekday === 6
								? "text-[#3b82f6]"
								: "text-neutral-800";

					return (
						<button
							key={cell.key}
							type="button"
							onClick={() => cell.inMonth && onSelect(cell.date)}
							className="flex h-12 flex-col items-center justify-start pt-1"
						>
							<span
								className={`flex h-7 w-7 items-center justify-center rounded-full text-sm tabular-nums ${
									isSelected
										? "bg-[#1f3a2e] font-semibold text-white"
										: baseColor
								}`}
							>
								{cell.date}
							</span>
							<span className="mt-1 flex h-1.5 items-center gap-0.5">
								{dots?.map((d, idx) => (
									<span
										key={`${cell.key}-${idx}`}
										className={`h-1.5 w-1.5 rounded-full ${
											d === "red" ? "bg-[#e74c3c]" : "bg-[#1f7a4a]"
										}`}
									/>
								))}
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
}

function DayEvents({ day, month }: { day: number; month: number }) {
	const date = new Date(2026, month - 1, day);
	const weekday = WEEK_LABELS[date.getDay()];

	return (
		<section className="mt-2">
			<div className="flex items-center justify-between px-1 pb-2">
				<p className="font-medium text-neutral-900 text-sm">
					{month}월 {day}일 {weekday}요일
				</p>
				<p className="text-neutral-400 text-xs">1개</p>
			</div>

			<article className="relative overflow-hidden rounded-2xl bg-white px-4 py-3 shadow-sm">
				<span className="absolute top-0 bottom-0 left-0 w-1 bg-[#c0392b]" />
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fde2e2] text-lg">
						❤️
					</div>
					<div className="min-w-0 flex-1">
						<span className="inline-block rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
							기념일
						</span>
						<p className="mt-1 truncate font-semibold text-[15px] text-neutral-900">
							엄마 생신
						</p>
						<p className="mt-1 flex items-center gap-1 text-neutral-400 text-xs">
							<ClockIcon /> 종일
						</p>
					</div>
				</div>
			</article>
		</section>
	);
}

function GearIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	);
}

function ClockIcon() {
	return (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}
