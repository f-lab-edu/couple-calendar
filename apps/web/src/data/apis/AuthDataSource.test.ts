import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { AuthDataSource } from "./AuthDataSource";

describe("AuthDataSource", () => {
	it("signInWithApple: POST /api/auth/apple body 직렬화", async () => {
		const fetchMock = stubFetchJson({
			accessToken: "token",
			user: { id: "user-1", email: "me@example.com", nickname: "지수" },
		});

		const result = await new AuthDataSource().signInWithApple({
			identityToken: "id-token",
			authorizationCode: "auth-code",
		});

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/auth/apple");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual({
			identityToken: "id-token",
			authorizationCode: "auth-code",
		});
		expect(result.user.id).toBe("user-1");
	});

	it("signInWithApple: 실패 시 에러", async () => {
		stubFetchError(401, "Unauthorized");

		await expect(
			new AuthDataSource().signInWithApple({ identityToken: "" }),
		).rejects.toThrow("Failed to sign in with Apple: 401 Unauthorized");
	});
});
