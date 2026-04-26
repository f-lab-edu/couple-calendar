import { Progress } from "woosign-system";
import { STEP, type Step } from "@/shared/constants/onboarding-step";

const TOTAL_STEPS = 2;

export const ProgressBar = ({ step }: { step: Step }) => {
	const value = step === STEP.PROFILE ? 1 : TOTAL_STEPS;
	return (
		<Progress value={value} max={TOTAL_STEPS} tone="ember" surface="light" size="sm" style={{ borderRadius: 0 }} />
	);
};
