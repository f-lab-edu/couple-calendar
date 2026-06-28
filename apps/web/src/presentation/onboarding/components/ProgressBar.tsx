import { STEP, type Step } from "@/shared/constants/onboarding-step";

const TOTAL_STEPS = 2;

/**
 * Bold B 다크 2칸 진행바. step에 따라 채워지는 칸 수를 결정한다.
 * (PROFILE → 1칸, CONNECT → 2칸)
 */
export const ProgressBar = ({ step }: { step: Step }) => {
	const filled = step === STEP.PROFILE ? 1 : TOTAL_STEPS;
	const segments = Array.from({ length: TOTAL_STEPS }, (_, idx) => `progress-seg-${idx}`);

	return (
		<div
			style={{
				display: "flex",
				gap: 6,
				padding: "calc(env(safe-area-inset-top) + 24px) 24px 0",
			}}
		>
			{segments.map((key, idx) => (
				<div
					key={key}
					style={{
						flex: 1,
						height: 4,
						borderRadius: 2,
						background: idx < filled ? "var(--action-primary)" : "var(--black-12)",
					}}
				/>
			))}
		</div>
	);
};
