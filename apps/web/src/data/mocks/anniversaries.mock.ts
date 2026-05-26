import type { AnniversaryResponse } from "@/data/dto/anniversary-response";
import { MOCK_IDS } from "./ids.mock";

const couple = MOCK_IDS.couple;

export const mockAutoAnniversaries: AnniversaryResponse[] = [
	{
		id: "a0000001-0000-4000-8000-000000000001",
		coupleId: couple,
		title: "500일",
		date: "2026-07-22",
		isRecurring: false,
		description: null,
		type: "AUTO",
		daysUntil: 84,
	},
	{
		id: "a0000002-0000-4000-8000-000000000002",
		coupleId: couple,
		title: "600일",
		date: "2026-10-30",
		isRecurring: false,
		description: null,
		type: "AUTO",
		daysUntil: 184,
	},
	{
		id: "a0000003-0000-4000-8000-000000000003",
		coupleId: couple,
		title: "2주년",
		date: "2027-03-09",
		isRecurring: false,
		description: null,
		type: "AUTO",
		daysUntil: 314,
	},
	{
		id: "a0000004-0000-4000-8000-000000000004",
		coupleId: couple,
		title: "1000일",
		date: "2027-12-04",
		isRecurring: false,
		description: null,
		type: "AUTO",
		daysUntil: 584,
	},
];

export const mockCustomAnniversaries: AnniversaryResponse[] = [
	{
		id: "a1000001-0000-4000-8000-000000000001",
		coupleId: couple,
		title: "지수 생일",
		date: "2026-08-14",
		isRecurring: true,
		description: "케이크 예약 잊지 말기",
		type: "CUSTOM",
		daysUntil: 107,
	},
	{
		id: "a1000002-0000-4000-8000-000000000002",
		coupleId: couple,
		title: "민준 생일",
		date: "2026-11-02",
		isRecurring: true,
		description: null,
		type: "CUSTOM",
		daysUntil: 187,
	},
	{
		id: "a1000003-0000-4000-8000-000000000003",
		coupleId: couple,
		title: "엄마 생신",
		date: "2027-04-25",
		isRecurring: true,
		description: "본가 방문",
		type: "CUSTOM",
		daysUntil: 361,
	},
	{
		id: "a1000004-0000-4000-8000-000000000004",
		coupleId: couple,
		title: "첫 여행",
		date: "2025-08-15",
		isRecurring: false,
		description: "제주도 3박 4일",
		type: "CUSTOM",
		daysUntil: -257,
	},
];

export const mockAnniversaries: AnniversaryResponse[] = [...mockCustomAnniversaries, ...mockAutoAnniversaries];

export const mockAnniversariesCustomOnly: AnniversaryResponse[] = mockCustomAnniversaries;
