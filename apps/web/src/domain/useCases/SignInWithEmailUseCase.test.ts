import { describe, expect, it, vi } from "vitest";
import AuthSession from "../entities/AuthSession";
import type { AuthRepository } from "../repositories/AuthRepository";
import { SignInWithEmailUseCase } from "./SignInWithEmailUseCase";

const makeRepository = (): AuthRepository => ({
	signInWithApple: vi.fn(),
	signInWithEmail: vi.fn(
		async (email: string) =>
			new AuthSession(`access-for-${email}`, {
				id: "user-1",
				email,
				nickname: "지수",
			}),
	),
});

describe("SignInWithEmailUseCase", () => {
	it("email을 trim해 repository에 위임한다", async () => {
		const repository = makeRepository();
		const useCase = new SignInWithEmailUseCase(repository);

		const session = await useCase.execute("  me@example.com  ", "secret123");

		expect(repository.signInWithEmail).toHaveBeenCalledWith("me@example.com", "secret123");
		expect(session.accessToken).toBe("access-for-me@example.com");
	});

	it.each(["", "   ", "\t\n"])("email이 공백(%s)이면 에러를 던지고 호출하지 않는다", async (email) => {
		const repository = makeRepository();
		const useCase = new SignInWithEmailUseCase(repository);

		await expect(useCase.execute(email, "secret123")).rejects.toThrow("이메일을 입력해 주세요.");
		expect(repository.signInWithEmail).not.toHaveBeenCalled();
	});

	it("password가 비면 에러를 던지고 호출하지 않는다", async () => {
		const repository = makeRepository();
		const useCase = new SignInWithEmailUseCase(repository);

		await expect(useCase.execute("me@example.com", "")).rejects.toThrow("비밀번호를 입력해 주세요.");
		expect(repository.signInWithEmail).not.toHaveBeenCalled();
	});
});
