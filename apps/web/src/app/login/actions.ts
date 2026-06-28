"use server";

import { createSession } from "@/app/lib/session";

/**
 * 로그인 성공 후 세션 쿠키를 발급한다.
 * accessToken/refreshToken은 선택값 — 전달되면 세션 payload에 함께 저장한다.
 * refreshToken은 accessToken 만료 시 BFF가 자동 갱신하는 데 쓴다.
 */
export async function loginAction(userId: string, accessToken?: string, refreshToken?: string) {
	await createSession(userId, accessToken, refreshToken);
}
