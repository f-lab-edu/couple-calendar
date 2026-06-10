"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithAppleUseCase } from "@/composition/auth";
import type AuthSession from "@/domain/entities/AuthSession";

export interface AppleSignInInput {
	identityToken: string;
	authorizationCode?: string;
}

/**
 * Apple identityToken으로 로그인하는 mutation hook.
 * UseCase만 호출하며, 세션 쿠키 발급/라우팅은 호출부(server action + router)에서 처리한다.
 */
const useAppleSignIn = () =>
	useMutation<AuthSession, Error, AppleSignInInput>({
		mutationFn: ({ identityToken, authorizationCode }) =>
			signInWithAppleUseCase.execute(identityToken, authorizationCode),
	});

export default useAppleSignIn;
