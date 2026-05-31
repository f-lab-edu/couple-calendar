import type { CoupleResponse } from "@/data/dto/couple-response";

interface ErrorResponseBody {
	code?: string;
	message?: string;
}

export class CoupleDataSource {
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
}
