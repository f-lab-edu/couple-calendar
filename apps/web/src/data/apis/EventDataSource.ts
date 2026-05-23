import type { EventResponse } from "@/data/dto/event-response";

/**
 * Remote data source for the Event aggregate.
 *
 * Issues real HTTP calls via the global `fetch` so the browser-side MSW
 * worker can intercept them. Always uses a relative URL — MSW v2's
 * `http.get("/api/events")` only matches against `window.location.origin`,
 * so absolute URLs (e.g. http://localhost:8080) would bypass the worker.
 */
export class EventDataSource {
	async getEvents(startDateIso: string, endDateIso: string): Promise<EventResponse[]> {
		const query = new URLSearchParams({
			startDate: startDateIso,
			endDate: endDateIso,
		});

		const response = await fetch(`/api/events?${query.toString()}`, {
			method: "GET",
			headers: { Accept: "application/json" },
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as EventResponse[];
		return data;
	}
}
