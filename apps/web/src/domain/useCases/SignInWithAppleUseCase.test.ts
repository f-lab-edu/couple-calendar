import { describe, expect, it, vi } from "vitest";
import AuthSession from "../entities/AuthSession";
import type { AuthRepository } from "../repositories/AuthRepository";
import { SignInWithAppleUseCase } from "./SignInWithAppleUseCase";

const makeRepository = (): AuthRepository => ({
	signInWithApple: vi.fn(
		async (identityToken: string) =>
			new AuthSession(`access-for-${identityToken}`, {
				id: "user-1",
				email: "me@example.com",
				nickname: "지수",
			}),
	),
});

describe("SignInWithAppleUseCase", () => {
	it("identityToken을 trim해 repository에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new SignInWithAppleUseCase(repository);

		const session = await useCase.execute("  token-abc  ");

		expect(repository.signInWithApple).toHaveBeenCalledWith("token-abc", undefined);
		expect(session.accessToken).toBe("access-for-token-abc");
		expect(session.user.id).toBe("user-1");
	});

	it("authorizationCode가 있으면 trim해 함께 전달한다", async () => {
		const repository = makeRepository();
		const useCase = new SignInWithAppleUseCase(repository);

		await useCase.execute("token-abc", "  code-xyz  ");

		expect(repository.signInWithApple).toHaveBeenCalledWith("token-abc", "code-xyz");
	});

	it("authorizationCode가 공백뿐이면 undefined로 전달한다", async () => {
		const repository = makeRepository();
		const useCase = new SignInWithAppleUseCase(repository);

		await useCase.execute("token-abc", "   ");

		expect(repository.signInWithApple).toHaveBeenCalledWith("token-abc", undefined);
	});

	it.each(["", "   ", "\t\n"])(
		"identityToken이 공백(%s)이면 에러를 던지고 호출하지 않는다",
		async (identityToken) => {
			const repository = makeRepository();
			const useCase = new SignInWithAppleUseCase(repository);

			await expect(useCase.execute(identityToken)).rejects.toThrow("Apple 로그인 토큰이 필요합니다.");
			expect(repository.signInWithApple).not.toHaveBeenCalled();
		},
	);
});
