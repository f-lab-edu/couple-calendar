import type { UserResponse } from "@/data/dto/user-response";
import { MOCK_IDS } from "./ids.mock";

export const mockMe: UserResponse = {
	id: MOCK_IDS.me,
	email: "jisoo@example.com",
	name: "지수",
	nickname: "지수누나",
	birthday: "1996-08-14",
	bio: "주말엔 산책, 평일엔 야근 ㅎㅎ",
	partnerNickname: "우리민준이",
	coupleId: MOCK_IDS.couple,
	createdAt: "2025-03-08T14:00:00Z",
	updatedAt: "2026-04-20T09:32:11Z",
};

export const mockPartner: UserResponse = {
	id: MOCK_IDS.partner,
	email: "minjun@example.com",
	name: "민준",
	nickname: "민준",
	birthday: "1995-11-02",
	bio: null,
	partnerNickname: null,
	coupleId: MOCK_IDS.couple,
	createdAt: "2025-03-09T03:21:08Z",
	updatedAt: "2026-04-18T22:10:55Z",
};

export const mockUsers: UserResponse[] = [mockMe, mockPartner];

export const mockCurrentUser: UserResponse = mockMe;

export const mockSoloUser: UserResponse = {
	id: "5f1c8e4a-2d3b-4f6e-9c7d-0a1b2c3d4e5f",
	email: "newbie@example.com",
	name: "새내기",
	nickname: "새내기",
	birthday: null,
	bio: null,
	partnerNickname: null,
	coupleId: null,
	createdAt: "2026-04-28T10:00:00Z",
	updatedAt: "2026-04-28T10:00:00Z",
};
