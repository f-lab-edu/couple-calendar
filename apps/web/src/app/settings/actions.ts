"use server";

import { logout } from "@/app/lib/session";

export async function logoutAction() {
	await logout();
}
