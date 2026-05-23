"use client";

import { useMemo, useState } from "react";
import { Fab } from "woosign-system";
import AddEventSheet from "@/app/home/_components/AddEventSheet";
import CalendarGrid from "@/app/home/_components/CalendarGrid";
import DayEvents from "@/app/home/_components/DayEvents";
import DdayCard from "@/app/home/_components/DdayCard";
import MonthNav from "@/app/home/_components/MonthNav";
import { buildMonthCells, compareCategories } from "@/app/home/_lib/calendar";
import type Event from "@/domain/entities/Event";
import type { EEventCategory } from "@/domain/entities/Event";
import useMonthlyEvents from "@/presentation/hooks/useMonthlyEvents";

const eventStartsOnLocalDay = (event: Event, year: number, month0Based: number, day: number): boolean => {
	const start = new Date(event.startTime);
	if (Number.isNaN(start.getTime())) return false;
	return start.getFullYear() === year && start.getMonth() === month0Based && start.getDate() === day;
};

export default function HomePage() {
	const [cursor, setCursor] = useState({ year: 2026, month: 3 });
	const [selected, setSelected] = useState(25);
	const [sheetOpen, setSheetOpen] = useState(false);

	const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month), [cursor]);

	// cursor.month is 0-based (UI convention); the hook expects 1-based months.
	const { data: monthlyEvents } = useMonthlyEvents(cursor.year, cursor.month + 1);

	const selectedDayEvents = useMemo<Event[]>(() => {
		if (!monthlyEvents) return [];
		return monthlyEvents.filter((event) => eventStartsOnLocalDay(event, cursor.year, cursor.month, selected));
	}, [monthlyEvents, cursor.year, cursor.month, selected]);

	const categoriesByDate = useMemo<Record<number, EEventCategory[]>>(() => {
		if (!monthlyEvents) return {};
		const buckets: Record<number, Set<EEventCategory>> = {};
		for (const event of monthlyEvents) {
			const start = new Date(event.startTime);
			if (Number.isNaN(start.getTime())) continue;
			if (start.getFullYear() !== cursor.year || start.getMonth() !== cursor.month) continue;
			const day = start.getDate();
			(buckets[day] ??= new Set<EEventCategory>()).add(event.category);
		}
		const result: Record<number, EEventCategory[]> = {};
		for (const [day, set] of Object.entries(buckets)) {
			result[Number(day)] = Array.from(set).sort(compareCategories);
		}
		return result;
	}, [monthlyEvents, cursor.year, cursor.month]);

	const goPrev = () => {
		setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
	};
	const goNext = () => {
		setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
	};

	return (
		<main className="mx-auto flex h-dvh max-w-[420px] flex-col gap-4 overflow-hidden bg-[#f6f5f0] px-4 py-5 text-[15px] text-neutral-800">
			<DdayCard />

			<section className="flex shrink-0 items-center justify-between">
				<MonthNav year={cursor.year} month={cursor.month} onPrev={goPrev} onNext={goNext} />
			</section>

			<CalendarGrid
				cells={cells}
				selected={selected}
				onSelect={setSelected}
				categoriesByDate={categoriesByDate}
			/>

			<DayEvents day={selected} month={cursor.month + 1} events={selectedDayEvents} />

			<div className="fixed bottom-6 right-[max(24px,calc(50%-186px))]">
				<Fab tone="ember" accessibilityLabel="새 이벤트 추가" onPress={() => setSheetOpen(true)}>
					<span className="-mt-0.5 text-3xl leading-none">+</span>
				</Fab>
			</div>

			<AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
		</main>
	);
}
