'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { ProgressBar } from "./_components/ProgressBar";
import OnboardingProfilePage from "./_components/OnboardingProfilePage";
import OnboardingConnectPage from "./_components/OnboadingConnectPage";
import { ROUTES } from "@/shared/constants/routes";
import { STEP, type Step } from "@/shared/constants/onboarding-step";

const OnboardingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step: Step = searchParams.get("step") === "connect" ? STEP.CONNECT : STEP.PROFILE;

  const moveToConnectStep = () => {
    router.push(ROUTES.ONBOARDING_STEP(STEP.CONNECT));
  };

  return (
    <div>
      <ProgressBar step={step} />
      {step === STEP.PROFILE && (
        <OnboardingProfilePage onPressNextButton={moveToConnectStep} />
      )}
      {step === STEP.CONNECT && <OnboardingConnectPage />}
    </div>
  );
};

export default OnboardingPage;