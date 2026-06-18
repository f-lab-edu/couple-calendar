import type { AppleAuthRequest, EmailAuthRequest } from "@/data/dto/auth-request";
import type { AuthResponse } from "@/data/dto/auth-response";

/**
 * Remote data source for authentication.
 *
 * Issues a real HTTP call via the global `fetch` so the browser-side MSW
 * worker can intercept it. Always uses a relative URL — MSW v2 only matches
 * against `window.location.origin`, so absolute URLs would bypass the worker.
 */
export class AuthDataSource {
	async signInWithApple(request: AppleAuthRequest): Promise<AuthResponse> {
		const response = await fetch("/api/auth/apple", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to sign in with Apple: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as AuthResponse;
	}

	async signInWithEmail(request: EmailAuthRequest): Promise<AuthResponse> {
		const response = await fetch("/api/auth/email", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to sign in with email: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as AuthResponse;
	}
}
