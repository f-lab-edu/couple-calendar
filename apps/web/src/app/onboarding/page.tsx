"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LogoutLink from "@/presentation/onboarding/components/LogoutLink";
import OnboardingConnectPage from "@/presentation/onboarding/components/OnboardingConnectPage";
import OnboardingProfilePage from "@/presentation/onboarding/components/OnboardingProfilePage";
import { ProgressBar } from "@/presentation/onboarding/components/ProgressBar";
import { STEP, type Step } from "@/shared/constants/onboarding-step";
import { ROUTES } from "@/shared/constants/routes";

const OnboardingContent = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const step: Step = searchParams.get("step") === "connect" ? STEP.CONNECT : STEP.PROFILE;

	const moveToConnectStep = () => {
		router.push(ROUTES.ONBOARDING_STEP(STEP.CONNECT));
	};

	return (
		<div>
			<LogoutLink />
			<ProgressBar step={step} />
			{step === STEP.PROFILE && <OnboardingProfilePage onPressNextButton={moveToConnectStep} />}
			{step === STEP.CONNECT && <OnboardingConnectPage />}
		</div>
	);
};

const OnboardingPage = () => (
	// useSearchParams는 Suspense 경계 안에 있어야 정적 프리렌더(빌드)가 통과한다.
	<Suspense fallback={<ProgressBar step={STEP.PROFILE} />}>
		<OnboardingContent />
	</Suspense>
);

export default OnboardingPage;
