import { HeartIcon } from "@/presentation/components/icons";

interface Props {
	myName: string;
	partnerName: string;
	startedAt: string;
	dPlus: number;
}

export const CoupleHero = ({ myName, partnerName, startedAt, dPlus }: Props) => (
	<div
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			padding: "16px 20px 24px",
			textAlign: "center",
			background: "var(--cream-200)",
		}}
	>
		<div className="mb-3 flex items-center" style={{ gap: -8 }}>
			<span
				className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
				style={{ background: "#3a2e33", border: "2px solid var(--cream-200)" }}
				aria-hidden
			>
				🌷
			</span>
			<span
				className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
				style={{ background: "#2c3a30", border: "2px solid var(--cream-200)", marginLeft: -12 }}
				aria-hidden
			>
				🌿
			</span>
		</div>
		<div
			className="flex items-center gap-2"
			style={{ marginTop: 4, fontSize: 16, fontWeight: 600, color: "var(--text-brand)" }}
		>
			<span>{myName}</span>
			<HeartIcon s={14} style={{ color: "var(--action-primary)" }} />
			<span>{partnerName}</span>
		</div>
		<p className="wb-caption" style={{ marginTop: 2 }}>
			{startedAt}부터 · D+{dPlus}
		</p>
	</div>
);
