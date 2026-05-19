"use server";

import { createSession } from "@/app/lib/session";

export async function loginAction(userId: string) {
	await createSession(userId);
}
