"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HomeIcon, PlusIcon, SearchIcon, UserIcon } from "@/presentation/components/icons";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
import EventSearchSheet from "@/presentation/events/components/EventSearchSheet";
import { dateString } from "@/presentation/events/lib/eventForm";
import CalendarGrid from "@/presentation/home/components/CalendarGrid";
import DayEvents from "@/presentation/home/components/DayEvents";
import DdayCard from "@/presentation/home/components/DdayCard";
import MonthNav from "@/presentation/home/components/MonthNav";
import PullToRefreshIndicator from "@/presentation/home/components/PullToRefreshIndicator";
import WeekStrip from "@/presentation/home/components/WeekStrip";
import WidgetSync from "@/presentation/home/components/WidgetSync";
import useCalendarCarousel from "@/presentation/home/hooks/useCalendarCarousel";
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";
import usePullToRefresh from "@/presentation/home/hooks/usePullToRefresh";
import useRequireCoupleConnected from "@/presentation/home/hooks/useRequireCoupleConnected";
import { ROUTES } from "@/shared/constants/routes";

export default function HomePage() {
	const { ready } = useRequireCoupleConnected();
	const calendar = useHomeCalendar();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const queryClient = useQueryClient();

	const handleRefresh = useCallback(() => queryClient.refetchQueries({ type: "active" }), [queryClient]);
	const { pull, refreshing, armed } = usePullToRefresh({
		onRefresh: handleRefresh,
		enabled: ready && !sheetOpen && !searchOpen,
	});

	// 좌우 드래그로 월 넘기기(카루셀): 현재 달 양옆에 이전·다음 달이 함께 깔려 있어 드래그하면
	// 인접 달이 연속으로 보인다. 손가락을 따라 움직이고, 임계 도달 후 놓으면 마저 전환, 미달이면
	// 스냅백. 월 네비 버튼도 같은 카루셀 전환을 탄다. 가로 우세 제스처만 추종한다.
	const carousel = useCalendarCarousel({
		onNext: calendar.goNext,
		onPrev: calendar.goPrev,
		cursorKey: `${calendar.year}-${calendar.month}`,
	});

	// 주 뷰도 동일한 3패널 카루셀을 주 단위로 재사용한다(이전·현재·다음 주). cursorKey 는
	// 선택일까지 포함해, 주가 바뀌면 가운데로 재정렬한다.
	const weekCarousel = useCalendarCarousel({
		onNext: calendar.goNextWeek,
		onPrev: calendar.goPrevWeek,
		cursorKey: `${calendar.year}-${calendar.month}-${calendar.selected}`,
	});

	// 커플 연결이 확인되기 전(또는 미연결로 온보딩 리다이렉트 중)에는 홈을 그리지 않는다.
	if (!ready) return null;

	// 임시 디버그: 현재 달 패널 배지일수 / 선택일 이벤트수 / 뷰모드 — 그리드 미표시 원인 추적용.
	const dbg = `m1=${calendar.months[1]?.key} badgeDays=${Object.keys(calendar.months[1]?.badgesByDate ?? {}).length} list=${calendar.selectedDayEvents.length} view=${calendar.viewMode}`;

	return (
		<>
			<div
				style={{
					position: "fixed",
					top: "calc(env(safe-area-inset-top) + 2px)",
					left: 4,
					zIndex: 100,
					fontSize: 10,
					color: "#0f0",
					background: "rgba(0,0,0,0.7)",
					padding: "2px 4px",
					borderRadius: 4,
					pointerEvents: "none",
				}}
			>
				{dbg}
			</div>
			<PullToRefreshIndicator pull={pull} refreshing={refreshing} armed={armed} />
			<WidgetSync />
			<main
				className="dark-scroll relative mx-auto flex min-h-dvh max-w-[420px] flex-col"
				style={{
					background: "var(--bg-page)",
					color: "var(--text-primary)",
					paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)",
					paddingBottom: "env(safe-area-inset-bottom)",
					transform: pull > 0 || refreshing ? `translateY(${pull}px)` : undefined,
					transition: pull === 0 ? "transform 200ms ease" : "none",
				}}
			>
				{/* 큰 영문 월 헤더 + 좌우 원형 버튼 (버튼도 카루셀 전환을 탄다) */}
				<section className="shrink-0 px-5 pt-1.5 pb-1">
					<MonthNav
						year={calendar.year}
						month={calendar.month}
						onPrev={calendar.viewMode === "week" ? weekCarousel.prev : carousel.prev}
						onNext={calendar.viewMode === "week" ? weekCarousel.next : carousel.next}
						onToday={calendar.goToday}
						isTodayMonth={calendar.isTodayMonth}
					/>
				</section>

				{/* 스크롤 본문: D-day 카드 + 달력(카루셀) + 선택일 상세. */}
				<div
					id="app-scroll"
					className="dark-scroll flex-1 overflow-x-hidden overflow-y-auto px-3 pt-1.5"
					style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
				>
					<div className="px-2 pb-4">
						<DdayCard />
					</div>

					{/* 월/주 뷰 토글 (오른쪽 정렬 세그먼트) */}
					<div className="mb-2 flex justify-end px-1">
						<div
							className="flex items-center gap-0.5 p-0.5"
							style={{ borderRadius: 999, background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.08)" }}
						>
							{(["month", "week"] as const).map((mode) => {
								const active = calendar.viewMode === mode;
								return (
									<button
										key={mode}
										type="button"
										onClick={() => calendar.setViewMode(mode)}
										aria-pressed={active}
										style={{
											padding: "5px 14px",
											borderRadius: 999,
											border: "none",
											cursor: "pointer",
											fontSize: 12.5,
											fontWeight: 700,
											background: active ? "#f4f4f3" : "transparent",
											color: active ? "#0d0d0e" : "var(--text-secondary)",
										}}
									>
										{mode === "month" ? "월" : "주"}
									</button>
								);
							})}
						</div>
					</div>

					{/* 월 뷰: 카루셀 뷰포트(가로 클립 + 터치 추종). 주 뷰일 땐 숨기되 언마운트하지
					    않는다 — 퍼센트 정렬이라 숨겨져도 위치가 유지돼 복귀 시 재정렬이 필요 없다. */}
					<div
						ref={carousel.viewportRef}
						className={`overflow-hidden ${calendar.viewMode === "week" ? "hidden" : ""}`}
						onTouchStart={carousel.onTouchStart}
						onTouchMove={carousel.onTouchMove}
						onTouchEnd={carousel.onTouchEnd}
					>
						{/* 트랙 폭=뷰포트×3, 패널 각 1/3(=1뷰포트). 명시적 폭이라 transform 퍼센트가
						    측정 없이 정확히 맞아 첫 페인트부터 가운데(현재) 패널이 보인다. */}
						<div ref={carousel.trackRef} className="flex will-change-transform" style={{ width: "300%" }}>
							{calendar.months.map((m, i) => (
								<div key={m.key} className="shrink-0" style={{ width: `${100 / 3}%` }}>
									<CalendarGrid
										year={m.year}
										month={m.month}
										cells={m.cells}
										selected={i === 1 ? calendar.selected : -1}
										onSelect={i === 1 ? calendar.selectDay : () => {}}
										badgesByDate={m.badgesByDate}
									/>
								</div>
							))}
						</div>
					</div>

					{/* 주 뷰: 월 카루셀과 같은 3패널 필름스트립을 주 단위로. 좌우로 끌면 인접 주가 연속으로 보인다. */}
					<div
						ref={weekCarousel.viewportRef}
						className={`overflow-hidden ${calendar.viewMode === "week" ? "" : "hidden"}`}
						onTouchStart={weekCarousel.onTouchStart}
						onTouchMove={weekCarousel.onTouchMove}
						onTouchEnd={weekCarousel.onTouchEnd}
					>
						<div ref={weekCarousel.trackRef} className="flex will-change-transform" style={{ width: "300%" }}>
							{calendar.weeks.map((w, i) => (
								<div key={w.key} className="shrink-0" style={{ width: `${100 / 3}%` }}>
									<WeekStrip days={w.days} onSelect={i === 1 ? calendar.selectDate : () => {}} />
								</div>
							))}
						</div>
					</div>

					<DayEvents
						year={calendar.year}
						day={calendar.selected}
						month={calendar.month + 1}
						events={calendar.selectedDayEvents}
					/>
				</div>

				<AddEventSheet
						open={sheetOpen}
						onClose={() => setSheetOpen(false)}
						initialDate={dateString(calendar.year, calendar.month, calendar.selected)}
					/>
			</main>

			{/* 플로팅 하단 네비: 화면 하단 중앙 캡슐. 홈 · 개인 · 이벤트 추가.
			    <main> 밖(형제)에 둬서 당겨서-새로고침 transform 의 영향을 받지 않고
			    항상 뷰포트 기준으로 고정된다(좌우 드래그 중 사라졌다 나타나는 현상 방지). */}
			<nav
				className="fixed inset-x-0 z-30 flex justify-center"
				style={{ bottom: "calc(env(safe-area-inset-bottom) + 4px)", pointerEvents: "none" }}
			>
				<div
					className="flex items-center gap-1 p-1.5"
					style={{
						borderRadius: 999,
						background: "#1a1a1c",
						border: "1px solid rgba(255,255,255,0.08)",
						boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
						pointerEvents: "auto",
					}}
				>
					{/* 홈 (현재 페이지, 활성) */}
					<button
						type="button"
						aria-label="홈"
						aria-current="page"
						className="flex h-12 w-14 items-center justify-center"
						style={{
							borderRadius: 999,
							border: "none",
							cursor: "pointer",
							background: "#f4f4f3",
							color: "#0d0d0e",
						}}
					>
						<HomeIcon s={20} />
					</button>
					{/* 검색 */}
					<button
						type="button"
						aria-label="일정 검색"
						onClick={() => setSearchOpen(true)}
						className="flex h-12 w-14 items-center justify-center"
						style={{ borderRadius: 999, border: "none", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
					>
						<SearchIcon s={20} />
					</button>
					{/* 개인 (설정) */}
					<Link
						href={ROUTES.SETTINGS}
						aria-label="개인"
						className="flex h-12 w-14 items-center justify-center"
						style={{ borderRadius: 999, color: "var(--text-secondary)" }}
					>
						<UserIcon s={21} />
					</Link>
					{/* 이벤트 추가 (주요 액션) */}
					<button
						type="button"
						aria-label="새 이벤트 추가"
						onClick={() => setSheetOpen(true)}
						className="flex h-12 w-14 items-center justify-center"
						style={{
							borderRadius: 999,
							border: "none",
							cursor: "pointer",
							background: "#F26419",
							color: "#fff",
						}}
					>
						<PlusIcon s={22} />
					</button>
				</div>
			</nav>

			<EventSearchSheet open={searchOpen} onClose={() => setSearchOpen(false)} />
		</>
	);
}
