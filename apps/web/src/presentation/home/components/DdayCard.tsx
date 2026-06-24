"use client";

import Link from "next/link";
import { SettingsIcon } from "@/presentation/components/icons";
import useAnniversaries from "@/presentation/anniversaries/hooks/useAnniversaries";
import { formatDday, pickNearestUpcoming } from "@/presentation/anniversaries/lib/anniversaryDisplay";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import { ROUTES } from "@/shared/constants/routes";
import { formatKoreanDate } from "@/shared/lib/date";

/**
 * 홈 상단 커플 히어로 + D-day 카드. 데이터(프로필/기념일/시작일)는 그대로 사용하고
 * Bold B 다크 토큰으로 재스킨한다. 목 데이터(지수/민준, D+412)는 쓰지 않고 실제 값만 표시.
 */
const DdayCard = () => {
	const { data: profile } = useCoupleProfile();
	const { data: anniversaries, isLoading: anniversariesLoading } = useAnniversaries();

	const myName = profile?.me.name ?? "나";
	const partnerName = profile?.partner?.name ?? "상대방";

	// 가장 가까운 AUTO 마일스톤(다가오는 D-day)을 대표로 표시. 없으면 커플 시작일 기준 D+.
	const autoMilestones = (anniversaries ?? []).filter((a) => a.type === "AUTO");
	const nearest = pickNearestUpcoming(autoMilestones);

	const hasStartDate = profile?.couple.startDate != null;

	const headline = nearest
		? formatDday(nearest.daysUntil)
		: hasStartDate
			? `D+${profile?.couple.daysFromStart ?? 0}`
			: "—";

	const subline = nearest
		? `${nearest.title} · ${formatKoreanDate(nearest.date)}`
		: hasStartDate && profile
			? `${formatKoreanDate(profile.couple.startDate)} 부터 함께`
			: anniversariesLoading
				? "불러오는 중…"
				: "기념일을 추가해 보세요";

	return (
		<div
			className="relative overflow-hidden"
			style={{
				background: "#1a1a1c",
				border: "1px solid rgba(255,255,255,0.08)",
				borderRadius: 20,
				padding: 20,
			}}
		>
			<Link
				href={ROUTES.SETTINGS}
				aria-label="설정"
				className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full"
				style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)" }}
			>
				<SettingsIcon s={18} />
			</Link>

			<div className="flex items-center gap-3">
				<div className="flex -space-x-2">
					<span
						className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
						style={{ background: "#FBE4EB", boxShadow: "0 0 0 0.5px rgba(0,0,0,0.08)" }}
					>
						🌷
					</span>
					<span
						className="flex h-11 w-11 items-center justify-center rounded-full text-xl"
						style={{ background: "#DFEEE3", border: "2px solid var(--bg-page)" }}
					>
						🌿
					</span>
				</div>
				<div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
					{myName} <span style={{ color: "#F2719A" }}>♥</span> {partnerName}
				</div>
			</div>

			<div className="mt-3">
				<div
					className="bold-round"
					style={{ fontSize: 36, lineHeight: "40px", fontWeight: 700, letterSpacing: "-0.5px", color: "var(--text-primary)" }}
				>
					{headline}
				</div>
				<div style={{ marginTop: 4, fontSize: 12, color: "var(--text-tertiary)" }}>{subline}</div>
			</div>
		</div>
	);
};

export default DdayCard;
