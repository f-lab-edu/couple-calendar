"use client";

import { useState } from "react";
import { Fab } from "woosign-system";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
import CalendarGrid from "@/presentation/home/components/CalendarGrid";
import DayEvents from "@/presentation/home/components/DayEvents";
import DdayCard from "@/presentation/home/components/DdayCard";
import MonthNav from "@/presentation/home/components/MonthNav";
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";
import useRequireCoupleConnected from "@/presentation/home/hooks/useRequireCoupleConnected";

export default function HomePage() {
	const { ready } = useRequireCoupleConnected();
	const calendar = useHomeCalendar();
	const [sheetOpen, setSheetOpen] = useState(false);

	// 커플 연결이 확인되기 전(또는 미연결로 온보딩 리다이렉트 중)에는 홈을 그리지 않는다.
	if (!ready) return null;

	return (
		<main className="mx-auto flex min-h-dvh max-w-[420px] flex-col gap-4 bg-[#f6f5f0] px-4 pt-[calc(env(safe-area-inset-top)_+_1.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_1.25rem)] text-[15px] text-neutral-800">
			<DdayCard />

			<section className="flex shrink-0 items-center justify-between">
				<MonthNav year={calendar.year} month={calendar.month} onPrev={calendar.goPrev} onNext={calendar.goNext} />
			</section>

			<CalendarGrid
				cells={calendar.cells}
				selected={calendar.selected}
				onSelect={calendar.selectDay}
				categoriesByDate={calendar.categoriesByDate}
			/>

			<DayEvents day={calendar.selected} month={calendar.month + 1} events={calendar.selectedDayEvents} />

			<div className="fixed bottom-[calc(env(safe-area-inset-bottom)_+_1.5rem)] right-[max(24px,calc(50%-186px))]">
				<Fab tone="ember" accessibilityLabel="새 이벤트 추가" onPress={() => setSheetOpen(true)}>
					<span className="-mt-0.5 text-3xl leading-none">+</span>
				</Fab>
			</div>

			<AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
		</main>
	);
}
