"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Fab } from "woosign-system";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
import CalendarGrid from "@/presentation/home/components/CalendarGrid";
import DayEvents from "@/presentation/home/components/DayEvents";
import DdayCard from "@/presentation/home/components/DdayCard";
import MonthNav from "@/presentation/home/components/MonthNav";
import PullToRefreshIndicator from "@/presentation/home/components/PullToRefreshIndicator";
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";
import usePullToRefresh from "@/presentation/home/hooks/usePullToRefresh";
import useRequireCoupleConnected from "@/presentation/home/hooks/useRequireCoupleConnected";

export default function HomePage() {
	const { ready } = useRequireCoupleConnected();
	const calendar = useHomeCalendar();
	const [sheetOpen, setSheetOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleRefresh = useCallback(() => queryClient.refetchQueries({ type: "active" }), [queryClient]);
	const { pull, refreshing, armed } = usePullToRefresh({
		onRefresh: handleRefresh,
		enabled: ready && !sheetOpen,
	});

	// 커플 연결이 확인되기 전(또는 미연결로 온보딩 리다이렉트 중)에는 홈을 그리지 않는다.
	if (!ready) return null;

	return (
		<>
			<PullToRefreshIndicator pull={pull} refreshing={refreshing} armed={armed} />
			<main
				className="mx-auto flex min-h-dvh max-w-[420px] flex-col gap-4 bg-white px-4 pt-[calc(env(safe-area-inset-top)_+_1.25rem)] pb-[calc(env(safe-area-inset-bottom)_+_1.25rem)] text-[15px] text-neutral-800"
				style={{
					transform: pull > 0 || refreshing ? `translateY(${pull}px)` : undefined,
					transition: pull === 0 ? "transform 200ms ease" : "none",
				}}
			>
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
		</>
	);
}
