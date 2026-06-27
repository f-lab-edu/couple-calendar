"use client";

import { useEffect } from "react";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import { todayParts } from "@/presentation/home/lib/calendar";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import { formatKoreanDate } from "@/shared/lib/date";

declare global {
	interface Window {
		ReactNativeWebView?: { postMessage: (s: string) => void };
	}
}

// 다음 일정 시각을 "오늘/내일 HH:mm" 또는 "M월 D일 HH:mm" 로.
const formatWhen = (iso: string): string => {
	const d = new Date(iso);
	const now = new Date();
	const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
	const dayDiff = Math.round((startOf(d) - startOf(now)) / 86_400_000);
	const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
	if (dayDiff === 0) return `오늘 ${time}`;
	if (dayDiff === 1) return `내일 ${time}`;
	return `${d.getMonth() + 1}월 ${d.getDate()}일 ${time}`;
};

/**
 * 홈 데이터(커플/ D-day / 다음 일정)를 네이티브 WebView 로 전달해 홈 위젯을 갱신한다.
 * WebView(ReactNativeWebView) 안에서만 동작하고, 일반 브라우저에선 no-op. 렌더는 없음.
 * D-day 산출은 DdayCard 와 동일 규칙(시작일 기준 D+ 함께한 일수).
 */
const WidgetSync = () => {
	const { data: profile } = useCoupleProfile();
	const today = todayParts();
	const { data: monthEvents } = useMonthlyEvents(today.year, today.month + 1);

	useEffect(() => {
		if (typeof window === "undefined" || !window.ReactNativeWebView) return;
		if (!profile?.couple) return;

		const myName = profile.me.name ?? "나";
		const partnerName = profile.partner?.name ?? "상대방";
		const hasStart = profile.couple.startDate != null;
		const ddayLabel = hasStart ? `D+${profile.couple.daysFromStart ?? 0}` : "—";
		const ddaySub = hasStart ? `${formatKoreanDate(profile.couple.startDate)} 부터 함께` : "";

		const now = Date.now();
		const upcoming = (monthEvents ?? [])
			.filter((e) => Date.parse(e.startTime) >= now)
			.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime))[0];

		const payload = {
			couple: `${myName} ♥ ${partnerName}`,
			ddayLabel,
			ddaySub,
			nextEventTitle: upcoming?.title ?? null,
			nextEventWhen: upcoming ? formatWhen(upcoming.startTime) : null,
		};
		window.ReactNativeWebView.postMessage(JSON.stringify({ type: "widget", payload }));
	}, [profile, monthEvents]);

	return null;
};

export default WidgetSync;
