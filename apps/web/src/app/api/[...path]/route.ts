import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt, encrypt } from "@/app/lib/session-crypto";

/**
 * BFF proxy: forwards `/api/*` to the real backend and injects the Supabase
 * access token (kept in the httpOnly session cookie) as a Bearer header so the
 * backend's AuthFilter accepts the request.
 *
 * accessToken은 ~1시간이면 만료된다. 만료로 401이 나면 세션에 저장해 둔 refresh token으로
 * `/api/auth/refresh`를 호출해 새 토큰을 받고(회전), 세션 쿠키를 갱신한 뒤 원요청을 1회
 * 재시도한다. 갱신이 불가능/실패한 401은 죽은 세션 쿠키를 비워 깨끗이 재로그인시킨다
 * (쿠키를 두면 proxy.ts가 /login→/home으로 되튕겨 흰 화면 루프가 된다).
 *
 * Only used when MSW mocking is OFF — with mocking ON, the service worker
 * intercepts these calls in the browser before they reach this route.
 */
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface SessionPayload {
	userId?: string;
	accessToken?: string;
	refreshToken?: string;
}

interface RotatedTokens {
	accessToken: string;
	refreshToken?: string;
}

/** refresh token으로 새 토큰 쌍을 발급받는다. 실패 시 null. */
async function refreshTokens(refreshToken: string): Promise<RotatedTokens | null> {
	try {
		const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
			method: "POST",
			headers: { "content-type": "application/json", accept: "application/json" },
			body: JSON.stringify({ refreshToken }),
		});
		if (!res.ok) return null;
		const data = (await res.json()) as { accessToken?: unknown; refreshToken?: unknown };
		if (typeof data.accessToken !== "string") return null;
		return {
			accessToken: data.accessToken,
			refreshToken: typeof data.refreshToken === "string" ? data.refreshToken : undefined,
		};
	} catch {
		return null;
	}
}

/**
 * 리프레시 single-flight(중복 제거).
 *
 * 콜드 스타트 때 홈이 여러 요청(프로필 + 월별 이벤트 3개)을 동시에 보내면, 각자 같은
 * 만료 accessToken 으로 401 → 같은 refreshToken 으로 동시에 리프레시를 호출한다. Supabase 는
 * refresh token 을 회전(1회용)시키므로 첫 호출만 성공하고 나머지는 "이미 쓴 토큰"으로 실패해
 * 세션이 비워지고 이벤트가 빈 채로 끝난다. 그래서 같은 refreshToken 으로 들어온 동시 호출은
 * 하나의 갱신 결과를 공유하고, 직후 잠깐(아래 TTL) 결과를 재사용해 뒤늦은 형제 요청도 구한다.
 */
const refreshDedupe = new Map<string, { at: number; promise: Promise<RotatedTokens | null> }>();
const REFRESH_DEDUPE_MS = 10_000;

function refreshTokensDeduped(refreshToken: string): Promise<RotatedTokens | null> {
	const hit = refreshDedupe.get(refreshToken);
	if (hit && Date.now() - hit.at < REFRESH_DEDUPE_MS) return hit.promise;
	const promise = refreshTokens(refreshToken);
	const entry = { at: Date.now(), promise };
	refreshDedupe.set(refreshToken, entry);
	// 결과 정착 후 TTL 지나면 정리(다음 진짜 만료 때 새로 갱신).
	promise.finally(() => {
		setTimeout(() => {
			if (refreshDedupe.get(refreshToken) === entry) refreshDedupe.delete(refreshToken);
		}, REFRESH_DEDUPE_MS);
	});
	return promise;
}

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
	const { path } = await ctx.params;
	const url = new URL(req.url);
	const target = `${API_BASE_URL}/api/${path.join("/")}${url.search}`;

	const session = (await cookies()).get("session")?.value;
	const payload = (await decrypt(session)) as SessionPayload | null;
	const accessToken = typeof payload?.accessToken === "string" ? payload.accessToken : null;
	const refreshToken = typeof payload?.refreshToken === "string" ? payload.refreshToken : null;

	// 본문은 한 번만 읽어 재시도 때 재사용한다.
	const body = req.method !== "GET" && req.method !== "HEAD" ? await req.text() : undefined;

	const send = (token: string | null) => {
		const headers = new Headers();
		const contentType = req.headers.get("content-type");
		if (contentType) headers.set("content-type", contentType);
		headers.set("accept", req.headers.get("accept") ?? "application/json");
		if (token) headers.set("authorization", `Bearer ${token}`);
		const init: RequestInit = { method: req.method, headers, redirect: "manual" };
		if (body !== undefined) init.body = body;
		return fetch(target, init);
	};

	let res = await send(accessToken);
	let rotated: RotatedTokens | null = null;

	// accessToken 만료(401) + refresh token 보유 → 토큰 갱신 후 원요청 1회 재시도.
	// 동시 401 폭주는 single-flight 로 하나의 갱신 결과를 공유한다(회전 토큰 race 방지).
	if (res.status === 401 && refreshToken) {
		rotated = await refreshTokensDeduped(refreshToken);
		if (rotated) res = await send(rotated.accessToken);
	}

	const resBody = await res.arrayBuffer();
	const resHeaders = new Headers();
	const resContentType = res.headers.get("content-type");
	if (resContentType) resHeaders.set("content-type", resContentType);
	const response = new NextResponse(resBody, { status: res.status, headers: resHeaders });

	if (rotated && res.status !== 401) {
		// 갱신 성공 → 새 토큰으로 세션 쿠키 재발급(롤링 7일). Supabase가 refresh token을
		// 회전시키므로 새 refreshToken을 저장하되, 안 내려오면 기존 것을 유지한다.
		const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
		const newSession = await encrypt({
			userId: payload?.userId,
			expiresAt,
			accessToken: rotated.accessToken,
			refreshToken: rotated.refreshToken ?? refreshToken ?? undefined,
		});
		response.cookies.set("session", newSession, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			expires: expiresAt,
			path: "/",
		});
	} else if (res.status === 401 && !rotated && (accessToken || refreshToken)) {
		// 갱신 자체가 불가/실패한 401만 죽은 세션으로 보고 정리(재로그인 유도, 흰 화면 루프 방지).
		// 갱신은 성공했는데(=rotated) 특정 요청만 401이면 세션을 비우지 않는다 — 방금 회전시킨
		// 다른 동시 요청들의 세션을 깨뜨리지 않기 위함.
		response.cookies.set("session", "", { path: "/", maxAge: 0, httpOnly: true });
	}

	return response;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
