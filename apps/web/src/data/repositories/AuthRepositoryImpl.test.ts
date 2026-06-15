import { describe, expect, it, vi } from "vitest";
import type { AuthDataSource } from "@/data/apis/AuthDataSource";
import type { AppleAuthRequest } from "@/data/dto/auth-request";
import type { AuthResponse } from "@/data/dto/auth-response";
import { AuthRepositoryImpl } from "./AuthRepositoryImpl";

const authDto = (overrides: Partial<AuthResponse> = {}): AuthResponse => ({
	accessToken: "access-token",
	user: { id: "user-1", email: "me@example.com", nickname: "지수" },
	...overrides,
});

const makeDataSource = (): AuthDataSource =>
	({
		signInWithApple: vi.fn(async (_request: AppleAuthRequest) => authDto()),
	}) as unknown as AuthDataSource;

describe("AuthRepositoryImpl", () => {
	it("signInWithApple: 요청을 DataSource에 전달하고 AuthSession으로 파싱한다", async () => {
		const ds = makeDataSource();
		const session = await new AuthRepositoryImpl(ds).signInWithApple("id-token", "auth-code");

		expect(ds.signInWithApple).toHaveBeenCalledWith({
			identityToken: "id-token",
			authorizationCode: "auth-code",
		});
		expect(session.accessToken).toBe("access-token");
		expect(session.user).toEqual({ id: "user-1", email: "me@example.com", nickname: "지수" });
	});

	it("authorizationCode 없이도 동작한다", async () => {
		const ds = makeDataSource();
		await new AuthRepositoryImpl(ds).signInWithApple("id-token");

		expect(ds.signInWithApple).toHaveBeenCalledWith({
			identityToken: "id-token",
			authorizationCode: undefined,
		});
	});
});
