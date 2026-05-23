import { HttpResponse, http } from "msw";
import type { EventCategory, EventResponse } from "@/data/dto/event-response";
import { mockEvents } from "../events.mock";
import { MOCK_IDS } from "../ids.mock";

interface CreateEventRequest {
	title: string;
	startTime: string;
	endTime: string;
	category: EventCategory;
	description?: string | null;
	location?: string | null;
}

type UpdateEventRequest = Partial<CreateEventRequest>;

// In-memory store. Resets on HMR / server restart — acceptable for dev mocks.
let eventStore: EventResponse[] = structuredClone(mockEvents);

const generateUuid = (): string => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	// Fallback for older runtimes
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.trunc(Math.random() * 16);
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

const parseDateBoundary = (value: string | null): number | null => {
	if (!value) return null;
	const time = Date.parse(value);
	if (Number.isNaN(time)) return null;
	return time;
};

const isValidCategory = (value: unknown): value is EventCategory =>
	value === "DATE" || value === "ANNIVERSARY" || value === "INDIVIDUAL" || value === "OTHER";

export const eventsHandlers = [
	http.get("/api/events", ({ request }) => {
		const url = new URL(request.url);
		const startBound = parseDateBoundary(url.searchParams.get("startDate"));
		const endBound = parseDateBoundary(url.searchParams.get("endDate"));

		const filtered = eventStore.filter((event) => {
			const eventStart = Date.parse(event.startTime);
			const eventEnd = Date.parse(event.endTime);
			if (startBound !== null && eventEnd < startBound) return false;
			if (endBound !== null && eventStart > endBound) return false;
			return true;
		});

		return HttpResponse.json(filtered);
	}),

	http.post("/api/events", async ({ request }) => {
		let body: CreateEventRequest | null = null;
		try {
			body = (await request.json()) as CreateEventRequest;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (!body?.title || !body.startTime || !body.endTime || !isValidCategory(body.category)) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "필수 필드가 누락되었습니다" }, { status: 400 });
		}

		const startMs = Date.parse(body.startTime);
		const endMs = Date.parse(body.endTime);
		if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "유효하지 않은 시간 범위입니다" }, { status: 400 });
		}

		const now = new Date().toISOString();
		const created: EventResponse = {
			id: generateUuid(),
			coupleId: MOCK_IDS.couple,
			title: body.title,
			startTime: body.startTime,
			endTime: body.endTime,
			category: body.category,
			authorId: MOCK_IDS.me,
			description: body.description ?? null,
			location: body.location ?? null,
			createdAt: now,
			updatedAt: now,
		};

		eventStore = [...eventStore, created];
		return HttpResponse.json(created, { status: 201 });
	}),

	http.patch("/api/events/:id", async ({ params, request }) => {
		const { id } = params as { id: string };
		const index = eventStore.findIndex((event) => event.id === id);
		if (index === -1) {
			return HttpResponse.json({ code: "NOT_FOUND", message: "이벤트를 찾을 수 없습니다" }, { status: 404 });
		}

		let body: UpdateEventRequest | null = null;
		try {
			body = (await request.json()) as UpdateEventRequest;
		} catch {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "잘못된 요청 본문입니다" }, { status: 400 });
		}

		if (body?.category && !isValidCategory(body.category)) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "유효하지 않은 카테고리입니다" }, { status: 400 });
		}

		const current = eventStore[index];
		const merged: EventResponse = {
			...current,
			...(body?.title !== undefined ? { title: body.title } : {}),
			...(body?.startTime !== undefined ? { startTime: body.startTime } : {}),
			...(body?.endTime !== undefined ? { endTime: body.endTime } : {}),
			...(body?.category !== undefined ? { category: body.category } : {}),
			...(body?.description !== undefined ? { description: body.description } : {}),
			...(body?.location !== undefined ? { location: body.location } : {}),
			updatedAt: new Date().toISOString(),
		};

		const startMs = Date.parse(merged.startTime);
		const endMs = Date.parse(merged.endTime);
		if (Number.isNaN(startMs) || Number.isNaN(endMs) || endMs <= startMs) {
			return HttpResponse.json({ code: "BAD_REQUEST", message: "유효하지 않은 시간 범위입니다" }, { status: 400 });
		}

		eventStore = [...eventStore.slice(0, index), merged, ...eventStore.slice(index + 1)];
		return HttpResponse.json(merged);
	}),

	http.delete("/api/events/:id", ({ params }) => {
		const { id } = params as { id: string };
		const exists = eventStore.some((event) => event.id === id);
		if (!exists) {
			return HttpResponse.json({ code: "NOT_FOUND", message: "이벤트를 찾을 수 없습니다" }, { status: 404 });
		}

		eventStore = eventStore.filter((event) => event.id !== id);
		return new HttpResponse(null, { status: 204 });
	}),
];

/** Test-only helper. Resets the in-memory store back to its seeded state. */
export const __resetEventsStoreForTests = () => {
	eventStore = structuredClone(mockEvents);
};
