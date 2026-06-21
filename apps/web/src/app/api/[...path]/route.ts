import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session-crypto";

/**
 * Dev proxy: forwards `/api/*` to the real backend and injects the Supabase
 * access token (kept in the httpOnly session cookie) as a Bearer header so the
 * backend's AuthFilter accepts the request.
 *
 * Only used when MSW mocking is OFF — with mocking ON, the service worker
 * intercepts these calls in the browser before they reach this route.
 */
const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

async function handler(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
	const { path } = await ctx.params;
	const url = new URL(req.url);
	const target = `${API_BASE_URL}/api/${path.join("/")}${url.search}`;

	const headers = new Headers();
	const contentType = req.headers.get("content-type");
	if (contentType) headers.set("content-type", contentType);
	headers.set("accept", req.headers.get("accept") ?? "application/json");

	const session = (await cookies()).get("session")?.value;
	const payload = await decrypt(session);
	const accessToken = typeof payload?.accessToken === "string" ? payload.accessToken : null;
	if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

	const init: RequestInit = { method: req.method, headers, redirect: "manual" };
	if (req.method !== "GET" && req.method !== "HEAD") {
		init.body = await req.text();
	}

	const res = await fetch(target, init);
	const body = await res.arrayBuffer();
	const resHeaders = new Headers();
	const resContentType = res.headers.get("content-type");
	if (resContentType) resHeaders.set("content-type", resContentType);
	const response = new NextResponse(body, { status: res.status, headers: resHeaders });

	// 토큰을 보냈는데 백엔드가 401이면 = 세션 안의 accessToken이 만료/무효.
	// 죽은 세션 쿠키를 비워 클라이언트가 깨끗이 재로그인하게 한다. 쿠키를 그대로 두면
	// session JWT(7일)는 유효해 proxy.ts가 /login→/home으로 되튕기고, /home은 다시
	// 401로 빈 화면이 되는 흰 화면 루프에 빠진다.
	if (res.status === 401 && accessToken) {
		response.cookies.set("session", "", { path: "/", maxAge: 0, httpOnly: true });
	}

	return response;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
