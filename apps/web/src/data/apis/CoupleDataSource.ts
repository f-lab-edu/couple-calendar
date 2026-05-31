import type { CoupleResponse, InviteCodeResponse } from "@/data/dto/couple-response";

interface ErrorResponseBody {
	code?: string;
	message?: string;
}

export class CoupleDataSource {
	async invite(startDate: string): Promise<InviteCodeResponse> {
		const response = await fetch("/api/couples/invite", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({ startDate }),
		});

		if (!response.ok) {
			throw new Error(`Failed to create invite code: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as InviteCodeResponse;
	}

	async connect(inviteCode: string): Promise<CoupleResponse> {
		const response = await fetch("/api/couples/connect", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify({ inviteCode }),
		});

		if (!response.ok) {
			const fallback = `Failed to connect couple: ${response.status} ${response.statusText}`;
			try {
				const body = (await response.json()) as ErrorResponseBody;
				throw new Error(body.message ?? fallback);
			} catch (e) {
				if (e instanceof Error && e.message !== fallback) throw e;
				throw new Error(fallback);
			}
		}

		return (await response.json()) as CoupleResponse;
	}

	async getMyCouple(): Promise<CoupleResponse> {
		const response = await fetch("/api/couples/me", {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch couple: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as CoupleResponse;
	}

	async disconnect(): Promise<void> {
		const response = await fetch("/api/couples/me", {
			method: "DELETE",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to disconnect couple: ${response.status} ${response.statusText}`);
		}
	}
}
