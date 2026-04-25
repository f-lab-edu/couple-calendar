import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const AUTH_COOKIE = process.env.AUTH_COOKIE_NAME ?? "cc-auth";

export type ServerFetchOptions = Omit<RequestInit, "credentials">;

export async function serverFetch<T>(path: string, options: ServerFetchOptions = {}): Promise<T> {
	const cookieStore = await cookies();
	const token = cookieStore.get(AUTH_COOKIE)?.value;

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}
