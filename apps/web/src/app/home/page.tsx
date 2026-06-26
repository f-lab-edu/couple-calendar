"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useState } from "react";
import { HomeIcon, PlusIcon, UserIcon } from "@/presentation/components/icons";
import AddEventSheet from "@/presentation/events/components/AddEventSheet";
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
					onTouchStart={swipe.onTouchStart}
					onTouchEnd={swipe.onTouchEnd}
				>
					<div className="px-2 pb-4">
						<DdayCard />
					</div>

					<CalendarGrid
						year={calendar.year}
						month={calendar.month}
						cells={calendar.cells}
						selected={calendar.selected}
						onSelect={calendar.selectDay}
						categoriesByDate={calendar.categoriesByDate}
					/>

					<DayEvents
						year={calendar.year}
						day={calendar.selected}
						month={calendar.month + 1}
						events={calendar.selectedDayEvents}
					/>
				</div>

				{/* 하단 커맨드바: 홈/탐색/프로필 pill (FAB는 아래에서 absolute로 띄운다) */}
				<div
					className="flex shrink-0 items-center"
					style={{ padding: "8px 16px calc(env(safe-area-inset-bottom) + 18px)" }}
				>
					<div
						className="flex items-center gap-1 p-1.5"
						style={{ borderRadius: 999, background: "#1a1a1c", border: "1px solid rgba(255,255,255,0.08)" }}
					>
						<button
							type="button"
							aria-label="홈"
							aria-current="page"
							className="inline-flex items-center gap-1.5"
							style={{
								padding: "9px 16px",
								borderRadius: 999,
								border: "none",
								cursor: "pointer",
								background: "#f4f4f3",
								color: "#0d0d0e",
							}}
						>
							<HomeIcon s={17} />
							<span style={{ fontSize: 13.5, fontWeight: 700 }}>홈</span>
						</button>
						<Link
							href={ROUTES.SETTINGS}
							aria-label="프로필"
							className="flex h-10 w-10 items-center justify-center"
							style={{ borderRadius: "50%", color: "var(--text-secondary)" }}
						>
							<UserIcon s={19} />
						</Link>
					</div>
				</div>

				{/* 플로팅 FAB: 뷰포트 우하단에 fixed로 떠 있어 스크롤해도 항상 보인다(콘텐츠 위 오버레이). */}
				<button
					type="button"
					aria-label="새 이벤트 추가"
					onClick={() => setSheetOpen(true)}
					className="fixed flex items-center justify-center"
					style={{
						right: 20,
						bottom: "calc(env(safe-area-inset-bottom) + 44px)",
						zIndex: 30,
						width: 54,
						height: 54,
						borderRadius: "50%",
						background: "#F26419",
						color: "#fff",
						border: "none",
						cursor: "pointer",
					}}
				>
					<PlusIcon s={24} />
				</button>

				<AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
			</main>
		</>
	);
}
