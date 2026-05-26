import type { CoupleResponse, InviteCodeResponse } from "@/data/dto/couple-response";
import { MOCK_COUPLE_START_DATE, MOCK_DAYS_FROM_START, MOCK_IDS } from "./ids.mock";

export const mockCouple: CoupleResponse = {
	id: MOCK_IDS.couple,
	user1Id: MOCK_IDS.me,
	user2Id: MOCK_IDS.partner,
	startDate: MOCK_COUPLE_START_DATE,
	inviteCode: null,
	inviteCodeExpiresAt: null,
	daysFromStart: MOCK_DAYS_FROM_START,
	isComplete: true,
	createdAt: "2025-03-09T05:00:00Z",
	updatedAt: "2025-03-09T05:00:00Z",
};

export const mockPendingCouple: CoupleResponse = {
	id: "8e3d2c1b-7a6f-4593-8d2e-1f0a9b8c7d6e",
	user1Id: MOCK_IDS.me,
	user2Id: null,
	startDate: "2026-04-29",
	inviteCode: "K3X9PQ",
	inviteCodeExpiresAt: "2026-04-30T05:00:00Z",
	daysFromStart: 0,
	isComplete: false,
	createdAt: "2026-04-29T05:00:00Z",
	updatedAt: "2026-04-29T05:00:00Z",
};

export const mockInviteCode: InviteCodeResponse = {
	inviteCode: "K3X9PQ",
	expiresAt: "2026-04-30T05:00:00Z",
};
