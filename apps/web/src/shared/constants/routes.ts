import type { Step } from "@/shared/constants/onboarding-step";

export const ROUTES = {
	HOME: "/home",
	LOGIN: "/login",
	SETTINGS: "/settings",
	SETTINGS_PROFILE_EDIT: "/settings/profile",
	SETTINGS_PARTNER_PROFILE: "/settings/partner",
	SETTINGS_NOTIFICATIONS: "/settings/notifications",
	SETTINGS_ANNIVERSARIES: "/settings/anniversaries",
	ONBOARDING: "/onboarding",
	ONBOARDING_CONNECT_CODE_GEN: "/onboarding/connect/code-gen",
	ONBOARDING_CONNECT_CODE_INPUT: "/onboarding/connect/code-input",
	ONBOARDING_STEP: (step: Step) => `/onboarding?step=${step}`,
};

export const LEGAL_LINKS = {
	PRIVACY: "https://woo-bottle.com/couple-calendar/privacy.html",
	TERMS: "https://woo-bottle.com/couple-calendar/terms.html",
};
