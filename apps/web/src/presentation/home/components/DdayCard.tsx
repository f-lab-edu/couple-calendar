"use client";

import Link from "next/link";
import { SettingsIcon } from "@/presentation/components/icons";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import { ROUTES } from "@/shared/constants/routes";
import { formatKoreanDate } from "@/shared/lib/date";

/**
 * 홈 상단 커플 히어로 + D-day 카드. 시작일 기준 함께한 일수(D+)를 대표로 표시한다
 * (기념일까지 남은 D−가 아니라). 데이터는 커플 프로필의 startDate / daysFromStart 사용.
 */
const DdayCard = () => {
	const { data: profile } = useCoupleProfile();

	const myName = profile?.me.name ?? "나";
	const partnerName = profile?.partner?.name ?? "상대방";

	const hasStartDate = profile?.couple.startDate != null;

	// 항상 시작일 기준 D+ (함께한 일수).
	const headline = hasStartDate ? `D+${profile?.couple.daysFromStart ?? 0}` : "—";

	const subline =
		hasStartDate && profile ? `${formatKoreanDate(profile.couple.startDate)} 부터 함께` : "기념일을 추가해 보세요";

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
