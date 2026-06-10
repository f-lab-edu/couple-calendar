"use server";

import { createSession } from "@/app/lib/session";

/**
 * 로그인 성공 후 세션 쿠키를 발급한다.
 * accessToken은 선택값 — 전달되면 세션 payload에 함께 저장한다(기존 호출 회귀 없음).
 */
export async function loginAction(userId: string, accessToken?: string) {
	await createSession(userId, accessToken);
}
