import type {
	CreateAnniversaryRequest,
	UpdateAnniversaryRequest,
} from "@/data/dto/anniversary-request";
import type { AnniversaryResponse } from "@/data/dto/anniversary-response";

/**
 * Remote data source for the Anniversary aggregate.
 *
 * Issues real HTTP calls via the global `fetch` so the browser-side MSW
 * worker can intercept them. Always uses a relative URL — MSW v2's
 * `http.get("/api/anniversaries")` only matches against `window.location.origin`,
 * so absolute URLs (e.g. http://localhost:8080) would bypass the worker.
 */
export class AnniversaryDataSource {
	async getAnniversaries(): Promise<AnniversaryResponse[]> {
		const response = await fetch("/api/anniversaries", {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(
				`Failed to fetch anniversaries: ${response.status} ${response.statusText}`,
			);
		}

		return (await response.json()) as AnniversaryResponse[];
	}

	async addAnniversary(request: CreateAnniversaryRequest): Promise<AnniversaryResponse> {
		const response = await fetch("/api/anniversaries", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to create anniversary: ${response.status} ${response.statusText}`,
			);
		}

		return (await response.json()) as AnniversaryResponse;
	}

	async updateAnniversary(
		id: string,
		request: UpdateAnniversaryRequest,
	): Promise<AnniversaryResponse> {
		const response = await fetch(`/api/anniversaries/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(
				`Failed to update anniversary: ${response.status} ${response.statusText}`,
			);
		}

		return (await response.json()) as AnniversaryResponse;
	}

	async deleteAnniversary(id: string): Promise<void> {
		const response = await fetch(`/api/anniversaries/${id}`, {
			method: "DELETE",
			headers: { Accept: "application/json" },
		});

		// 204 No Content (empty body) — never call response.json() here.
		if (!response.ok) {
			throw new Error(
				`Failed to delete anniversary: ${response.status} ${response.statusText}`,
			);
		}
	}
}
