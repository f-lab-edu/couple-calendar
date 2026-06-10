"use client";

import Link from "next/link";
import { Card, Text } from "woosign-system";
import useAnniversaries from "@/presentation/anniversaries/hooks/useAnniversaries";
import { formatDday, pickNearestUpcoming } from "@/presentation/anniversaries/lib/anniversaryDisplay";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import GearIcon from "@/shared/components/GearIcon";
import { ROUTES } from "@/shared/constants/routes";
import { formatKoreanDate } from "@/shared/lib/date";

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
		<Card
			variant="forest"
			fullWidth
			style={{
				position: "relative",
				overflow: "hidden",
				borderRadius: 24,
				padding: "20px",
			}}
		>
			<div className="-right-8 -top-10 pointer-events-none absolute h-40 w-40 rounded-full border border-white/10" />
			<div className="-right-16 -bottom-16 pointer-events-none absolute h-44 w-44 rounded-full border border-white/10" />

			<Link
				href={ROUTES.SETTINGS}
				className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/90 hover:bg-white/15"
			>
				<GearIcon />
			</Link>

			<div className="relative flex items-center gap-3">
				<div className="flex -space-x-2">
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e7d6] text-xl ring-2 ring-[#1f3a2e]">
						🌷
					</div>
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8e1cf] text-xl ring-2 ring-[#1f3a2e]">
						🌿
					</div>
				</div>
				<Text as="p" variant="small" style={{ color: "rgba(255,255,255,0.8)" }}>
					{myName} <span style={{ color: "#ff7b8a" }}>♥</span> {partnerName}
				</Text>
			</div>

			<div className="relative mt-3">
				<Text
					as="p"
					weight="semibold"
					style={{
						color: "#fff",
						fontSize: 36,
						lineHeight: "40px",
						letterSpacing: "-0.5px",
					}}
				>
					{headline}
				</Text>
				<Text
					as="p"
					variant="small"
					style={{ color: "rgba(255,255,255,0.7)", marginTop: 4, fontSize: 12 }}
				>
					{subline}
				</Text>
			</div>
		</Card>
	);
};

export default DdayCard;
