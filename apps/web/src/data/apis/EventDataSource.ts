import type { CreateEventRequest, UpdateEventRequest } from "@/data/dto/event-request";
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

	async createEvent(request: CreateEventRequest): Promise<EventResponse> {
		const response = await fetch("/api/events", {
			method: "POST",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to create event: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as EventResponse;
	}

	async updateEvent(id: string, request: UpdateEventRequest): Promise<EventResponse> {
		const response = await fetch(`/api/events/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json", Accept: "application/json" },
			body: JSON.stringify(request),
		});

		if (!response.ok) {
			throw new Error(`Failed to update event: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as EventResponse;
	}

	async deleteEvent(id: string): Promise<void> {
		const response = await fetch(`/api/events/${id}`, {
			method: "DELETE",
			headers: { Accept: "application/json" },
		});

		// 204 No Content (empty body) — never call response.json() here.
		if (!response.ok) {
			throw new Error(`Failed to delete event: ${response.status} ${response.statusText}`);
		}
	}
}
