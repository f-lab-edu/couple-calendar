"use client";

import { useRouter, useSearchParams } from "next/navigation";
import OnboardingConnectPage from "@/presentation/onboarding/components/OnboadingConnectPage";
import OnboardingProfilePage from "@/presentation/onboarding/components/OnboardingProfilePage";
import { ProgressBar } from "@/presentation/onboarding/components/ProgressBar";
import { STEP, type Step } from "@/shared/constants/onboarding-step";
import { ROUTES } from "@/shared/constants/routes";

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
			{step === STEP.PROFILE && <OnboardingProfilePage onPressNextButton={moveToConnectStep} />}
			{step === STEP.CONNECT && <OnboardingConnectPage />}
		</div>
	);
};

export default OnboardingPage;
