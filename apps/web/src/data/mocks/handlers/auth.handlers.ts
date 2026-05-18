import { HttpResponse, http } from "msw";
import type { AuthResponse } from "@/data/dto/auth-response";
import { mockAuthNewUserResponse, mockAuthResponse } from "../auth.mock";

interface AppleAuthRequestBody {
	identityToken: string;
	authorizationCode?: string;
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
];
