export const STEP = {
	PROFILE: "profile",
	CONNECT: "connect",
} as const;

export type Step = (typeof STEP)[keyof typeof STEP];
