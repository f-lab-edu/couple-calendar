import type { Step } from "@/shared/constants/onboarding-step";

export const ROUTES = {
	LOGIN: "/login",
	SETTINGS: "/settings",
	ONBOARDING: "/onboarding",
	ONBOARDING_CONNECT_CODE_GEN: "/onboarding/connect/code-gen",
	ONBOARDING_CONNECT_CODE_INPUT: "/onboarding/connect/code-input",
	ONBOARDING_STEP: (step: Step) => `/onboarding?step=${step}`,
};
