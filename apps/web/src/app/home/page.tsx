"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HomeIcon, PlusIcon, UserIcon } from "@/presentation/components/icons";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
import { dateString } from "@/presentation/events/lib/eventForm";
import CalendarGrid from "@/presentation/home/components/CalendarGrid";
import DayEvents from "@/presentation/home/components/DayEvents";
import DdayCard from "@/presentation/home/components/DdayCard";
import MonthNav from "@/presentation/home/components/MonthNav";
import PullToRefreshIndicator from "@/presentation/home/components/PullToRefreshIndicator";
import WidgetSync from "@/presentation/home/components/WidgetSync";
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";
import usePullToRefresh from "@/presentation/home/hooks/usePullToRefresh";
import useRequireCoupleConnected from "@/presentation/home/hooks/useRequireCoupleConnected";
import useSwipe from "@/presentation/home/hooks/useSwipe";
import { ROUTES } from "@/shared/constants/routes";

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

	// 좌우 스와이프로 월 넘기기(왼쪽=다음 달, 오른쪽=이전 달). 가로 우세 제스처만
	// 인정하므로 세로 스크롤·당겨서 새로고침과 충돌하지 않는다.
	const swipe = useSwipe({ onSwipeLeft: calendar.goNext, onSwipeRight: calendar.goPrev });

	// 커플 연결이 확인되기 전(또는 미연결로 온보딩 리다이렉트 중)에는 홈을 그리지 않는다.
	if (!ready) return null;

	return (
		<>
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
				{/* 큰 영문 월 헤더 + 좌우 원형 버튼 */}
				<section className="shrink-0 px-5 pt-1.5 pb-1">
					<MonthNav year={calendar.year} month={calendar.month} onPrev={calendar.goPrev} onNext={calendar.goNext} />
				</section>

				{/* 스크롤 본문: D-day 카드 + 달력 + 선택일 상세. 좌우 스와이프로 월 전환. */}
				<div
					className="dark-scroll flex-1 overflow-auto px-3 pt-1.5"
					style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}
					onTouchStart={swipe.onTouchStart}
					onTouchEnd={swipe.onTouchEnd}
				>
					<div className="px-2 pb-4">
						<DdayCard />
					</div>

					<CalendarGrid
						key={`${calendar.year}-${calendar.month}`}
						year={calendar.year}
						month={calendar.month}
						cells={calendar.cells}
						selected={calendar.selected}
						navigationDirection={calendar.navigationDirection}
						onSelect={calendar.selectDay}
						badgesByDate={calendar.badgesByDate}
					/>

					<DayEvents
						year={calendar.year}
						day={calendar.selected}
						month={calendar.month + 1}
						events={calendar.selectedDayEvents}
					/>
				</div>

				{/* 플로팅 하단 네비: 화면 하단 중앙에 떠 있는 캡슐. 홈 · 개인 · 이벤트 추가.
				    스크롤해도 항상 보이도록 fixed로 띄운다(본문은 아래 paddingBottom으로 가림 방지). */}
				<nav
					className="fixed inset-x-0 z-30 flex justify-center"
					style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)", pointerEvents: "none" }}
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

				<AddEventSheet
						open={sheetOpen}
						onClose={() => setSheetOpen(false)}
						initialDate={dateString(calendar.year, calendar.month, calendar.selected)}
					/>
			</main>
		</>
	);
}
