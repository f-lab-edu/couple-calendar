"use client";

import { useMemo, useState } from "react";
import { Fab } from "woosign-system";
import CalendarGrid from "@/app/_components/CalendarGrid";
import DayEvents from "@/app/_components/DayEvents";
import DdayCard from "@/app/_components/DdayCard";
import MonthNav from "@/app/_components/MonthNav";
import ViewToggle, { type CalendarView } from "@/app/_components/ViewToggle";
import { buildMonthCells } from "@/app/_lib/calendar";

export default function HomePage() {
	const [view, setView] = useState<CalendarView>("month");
	const [cursor, setCursor] = useState({ year: 2026, month: 3 });
	const [selected, setSelected] = useState(25);

	const cells = useMemo(() => buildMonthCells(cursor.year, cursor.month), [cursor]);

	const goPrev = () => {
		setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
	};
	const goNext = () => {
		setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));
	};

	return (
		<main className="mx-auto flex min-h-screen max-w-[420px] flex-col gap-4 bg-[#f6f5f0] px-4 py-5 text-[15px] text-neutral-800">
			<DdayCard />

			<section className="flex items-center justify-between">
				<ViewToggle value={view} onChange={setView} />
				<MonthNav year={cursor.year} month={cursor.month} onPrev={goPrev} onNext={goNext} />
			</section>

			<CalendarGrid cells={cells} selected={selected} onSelect={setSelected} />

			<DayEvents day={selected} month={cursor.month + 1} />

			<div className="fixed bottom-6 right-[max(24px,calc(50%-186px))]">
				<Fab tone="ember" accessibilityLabel="새 이벤트 추가">
					<span className="-mt-0.5 text-3xl leading-none">+</span>
				</Fab>
			</div>
		</main>
	);
}
