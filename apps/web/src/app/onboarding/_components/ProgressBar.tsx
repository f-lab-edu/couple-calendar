import { STEP, type Step } from "@/shared/constants/onboarding-step";
import { colors } from "woosign-system";

const INACTIVE_COLOR = "#d1d5db";

export const ProgressBar = ({ step }: { step: Step }) => {
  return (
    <div className="flex">
      <div
        className="w-1/2 h-1"
        style={{ backgroundColor: step === STEP.PROFILE ? colors.actionPrimary : INACTIVE_COLOR }}
      />
      <div
        className="w-1/2 h-1"
        style={{ backgroundColor: step === STEP.CONNECT ? colors.actionPrimary : INACTIVE_COLOR }}
      />
    </div>
  );
};
