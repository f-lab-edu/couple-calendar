import { ClockIcon } from "@/presentation/components/icons";

interface TimeBlockProps {
	label: string;
	time: string;
	disabled?: boolean;
}

/**
 * Bold B 시작/종료 시간 표시 블록(다크). 라벨 + 시간 + 시계 아이콘.
 * presentational 컴포넌트로, 표시 계약(label/time/disabled)은 그대로 유지한다.
 */
const TimeBlock = ({ label, time, disabled }: TimeBlockProps) => (
	<div
		className="flex flex-col items-start gap-1"
		style={{
			borderRadius: 12,
			padding: "10px 16px",
			textAlign: "left",
			background: "#1a1a1c",
			border: "1px solid rgba(255,255,255,0.14)",
			opacity: disabled ? 0.4 : 1,
		}}
	>
		<span style={{ fontSize: 11, color: "var(--text-secondary)" }}>{label}</span>
		<span className="bold-grotesk flex items-center gap-1.5">
			<span style={{ fontSize: 16, fontWeight: 600, color: "#F26419" }}>{time}</span>
			<span aria-hidden style={{ color: "var(--text-tertiary)" }}>
				<ClockIcon s={14} />
			</span>
		</span>
	</div>
);

export default TimeBlock;
