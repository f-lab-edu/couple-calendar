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
import useHomeCalendar from "@/presentation/home/hooks/useHomeCalendar";
import usePullToRefresh from "@/presentation/home/hooks/usePullToRefresh";
import useRequireCoupleConnected from "@/presentation/home/hooks/useRequireCoupleConnected";
import { ROUTES } from "@/shared/constants/routes";

/** 하단 커맨드바의 탐색(미구현) 버튼용 지구본 아이콘 — 디자인 원본과 동일. */
const ExploreIcon = ({ s = 19 }: { s?: number }) => (
	<svg
		width={s}
		height={s}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.8}
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="탐색"
	>
		<circle cx="12" cy="12" r="9" />
		<path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
	</svg>
);

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

				{/* 스크롤 본문: D-day 카드 + 달력 + 선택일 상세 */}
				<div className="dark-scroll flex-1 overflow-auto px-3 pt-1.5">
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

				{/* 하단 커맨드바: 홈/탐색/프로필 pill + 오렌지 FAB */}
				<div
					className="flex shrink-0 items-center justify-between gap-2.5"
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
						<button
							type="button"
							aria-label="탐색"
							disabled
							className="flex h-10 w-10 items-center justify-center"
							style={{ borderRadius: "50%", border: "none", background: "transparent", color: "var(--text-tertiary)", cursor: "not-allowed" }}
						>
							<ExploreIcon />
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

					<button
						type="button"
						aria-label="새 이벤트 추가"
						onClick={() => setSheetOpen(true)}
						className="flex shrink-0 items-center justify-center"
						style={{
							width: 54,
							height: 54,
							borderRadius: "50%",
							background: "#F26419",
							color: "#fff",
							border: "none",
							cursor: "pointer",
							boxShadow: "0 8px 22px rgba(242,100,25,0.4)",
						}}
					>
						<PlusIcon s={24} />
					</button>
				</div>

				<AddEventSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
			</main>
		</>
	);
}
