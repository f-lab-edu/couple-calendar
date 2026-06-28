"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithEmailUseCase } from "@/composition/auth";
import type AuthSession from "@/domain/entities/AuthSession";

export interface EmailSignInInput {
	email: string;
	password: string;
}

/**
 * 이메일/비밀번호로 로그인하는 mutation hook.
 * UseCase만 호출하며, 세션 쿠키 발급/라우팅은 호출부(server action + router)에서 처리한다.
 */
const useEmailSignIn = () =>
	useMutation<AuthSession, Error, EmailSignInInput>({
		mutationFn: ({ email, password }) => signInWithEmailUseCase.execute(email, password),
	});

export default useEmailSignIn;
