"use client";

import { useState } from "react";
import { Fab } from "woosign-system";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
import CalendarGrid from "@/presentation/home/components/CalendarGrid";
import DayEvents from "@/presentation/home/components/DayEvents";
import DdayCard from "@/presentation/home/components/DdayCard";
import MonthNav from "@/presentation/home/components/MonthNav";
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";

export default function HomePage() {
	const calendar = useHomeCalendar();
	const [sheetOpen, setSheetOpen] = useState(false);

	return (
		<main className="mx-auto flex h-dvh max-w-[420px] flex-col gap-4 overflow-hidden bg-[#f6f5f0] px-4 py-5 text-[15px] text-neutral-800">
			<DdayCard />

			<section className="flex shrink-0 items-center justify-between">
				<MonthNav year={calendar.year} month={calendar.month} onPrev={calendar.goPrev} onNext={calendar.goNext} />
			</section>

			<CalendarGrid
				key={`${calendar.year}-${calendar.month}`}
				cells={calendar.cells}
				selected={calendar.selected}
				navigationDirection={calendar.navigationDirection}
				onSelect={calendar.selectDay}
				categoriesByDate={calendar.categoriesByDate}
			/>

			<DayEvents day={calendar.selected} month={calendar.month + 1} events={calendar.selectedDayEvents} />

			<div className="fixed bottom-6 right-[max(24px,calc(50%-186px))]">
				<Fab tone="ember" accessibilityLabel="새 이벤트 추가" onPress={() => setSheetOpen(true)}>
					<span className="-mt-0.5 text-3xl leading-none">+</span>
				</Fab>
			</div>

			<AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
		</main>
	);
}
