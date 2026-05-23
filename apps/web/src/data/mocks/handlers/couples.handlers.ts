import { HttpResponse, http } from "msw";
import { mockCouple, mockInviteCode } from "../couples.mock";

interface InviteRequestBody {
	startDate: string;
}

interface ConnectRequestBody {
	inviteCode: string;
}

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

	http.get("/api/couples/:id", () => HttpResponse.json(mockCouple)),
];
