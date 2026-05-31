import { HttpResponse, http } from "msw";
import type { CoupleResponse } from "@/data/dto/couple-response";
import { mockCouple, mockInviteCode } from "../couples.mock";

interface InviteRequestBody {
	startDate: string;
}

interface ConnectRequestBody {
	inviteCode: string;
}

interface UpdateCoupleRequestBody {
	startDate?: string;
}

const MS_PER_DAY = 86_400_000;

// 시작일 수정이 누적되도록 커플을 가변 스토어로 보관한다.
let coupleStore: CoupleResponse = structuredClone(mockCouple);

const daysFromStart = (startDate: string): number => {
	const start = Date.parse(`${startDate.slice(0, 10)}T00:00:00Z`);
	if (Number.isNaN(start)) return 0;
	const today = new Date();
	const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
	return Math.max(0, Math.floor((todayUtc - start) / MS_PER_DAY));
};

export const couplesHandlers = [
	http.post("/api/couples/invite", async ({ request }) => {
		let body: InviteRequestBody | null = null;
		try {
			body = (await request.json()) as InviteRequestBody;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.startDate) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "startDate가 필요합니다" }, { status: 400 });
		}

		return HttpResponse.json(mockInviteCode);
	}),

	http.post("/api/couples/connect", async ({ request }) => {
		let body: ConnectRequestBody | null = null;
		try {
			body = (await request.json()) as ConnectRequestBody;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.inviteCode) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "inviteCode가 필요합니다" }, { status: 400 });
		}

		return HttpResponse.json(mockCouple);
	}),

	// NOTE(backend gap): GET /api/couples/me 는 백엔드 스펙에 없음 → mock으로 임시 대응.
	// "/me"는 "/:id"보다 먼저 등록해야 :id 핸들러에 가로채이지 않는다.
	http.get("/api/couples/me", () => HttpResponse.json(coupleStore)),

	// NOTE(backend gap): PATCH /api/couples/me (시작일 수정) 백엔드 미구현 → mock.
	http.patch("/api/couples/me", async ({ request }) => {
		let body: UpdateCoupleRequestBody | null = null;
		try {
			body = (await request.json()) as UpdateCoupleRequestBody;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.startDate) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "startDate가 필요합니다" }, { status: 400 });
		}

		coupleStore = {
			...coupleStore,
			startDate: body.startDate,
			daysFromStart: daysFromStart(body.startDate),
			updatedAt: new Date().toISOString(),
		};

		return HttpResponse.json(coupleStore);
	}),

	// NOTE(backend gap): DELETE /api/couples/me (연결 해제)도 백엔드 미구현 → mock.
	http.delete("/api/couples/me", () => new HttpResponse(null, { status: 204 })),

	http.get("/api/couples/:id", () => HttpResponse.json(coupleStore)),
];

/** Test-only helper. 시드 상태로 되돌린다. */
export const __resetCoupleStoreForTests = () => {
	coupleStore = structuredClone(mockCouple);
};
