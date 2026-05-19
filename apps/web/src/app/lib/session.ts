import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, encrypt } from "./session-crypto";

export { decrypt, encrypt };

export async function createSession(userId: string) {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const session = await encrypt({ userId, expiresAt });
	const cookieStore = await cookies();

	cookieStore.set("session", session, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
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
