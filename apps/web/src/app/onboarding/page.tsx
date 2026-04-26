"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { STEP, type Step } from "@/shared/constants/onboarding-step";
import { ROUTES } from "@/shared/constants/routes";
import OnboardingConnectPage from "./_components/OnboadingConnectPage";
import OnboardingProfilePage from "./_components/OnboardingProfilePage";
import { ProgressBar } from "./_components/ProgressBar";

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
