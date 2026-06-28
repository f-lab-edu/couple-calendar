import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "./session-crypto";

export { decrypt, encrypt };

export async function createSession(userId: string, accessToken?: string, refreshToken?: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await encrypt({
		userId,
		expiresAt,
		...(accessToken ? { accessToken } : {}),
		...(refreshToken ? { refreshToken } : {}),
	});
	const cookieStore = await cookies();

	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		// expires가 없으면 세션 쿠키가 되어 앱(WebView 프로세스) 종료 시 폐기 → 재실행 시 로그인 풀림.
		// 영속 쿠키로 만들어 7일간 로그인 유지한다.
		expires: expiresAt,
		path: "/",
	});
}

export async function updateSession() {
	const session = (await cookies()).get("session")?.value;
	const payload = await decrypt(session);

	if (!session) return null;
	if (!payload) return null;

	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const cookieStore = await cookies();
	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		expires,
		path: "/",
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete("session");
}

export async function logout() {
	await deleteSession();
	redirect("/login");
}
