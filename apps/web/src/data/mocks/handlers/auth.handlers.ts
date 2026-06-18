import { HttpResponse, http } from "msw";
import type { AuthResponse } from "@/data/dto/auth-response";
import { mockAuthNewUserResponse, mockAuthResponse } from "../auth.mock";

interface AppleAuthRequestBody {
	identityToken: string;
	authorizationCode?: string;
}

interface EmailAuthRequestBody {
	email: string;
	password: string;
}

export const authHandlers = [
	http.post("/api/auth/apple", async ({ request }) => {
		let body: AppleAuthRequestBody | null = null;
		try {
			body = (await request.json()) as AppleAuthRequestBody;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.identityToken) {
			return HttpResponse.json({ code: "UNAUTHORIZED", message: "identityToken이 필요합니다" }, { status: 401 });
		}

		const response: AuthResponse = body.identityToken.includes("new") ? mockAuthNewUserResponse : mockAuthResponse;

		return HttpResponse.json(response);
	}),

	http.post("/api/auth/email", async ({ request }) => {
		let body: EmailAuthRequestBody | null = null;
		try {
			body = (await request.json()) as EmailAuthRequestBody;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.email || !body?.password) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "이메일과 비밀번호가 필요합니다" }, { status: 400 });
		}

		// 신규 이메일(new 포함)은 신규 유저로 분기.
		const response: AuthResponse = body.email.includes("new") ? mockAuthNewUserResponse : mockAuthResponse;

		return HttpResponse.json(response);
	}),
];
