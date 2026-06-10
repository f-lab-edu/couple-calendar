import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { EventDataSource } from "./EventDataSource";

describe("EventDataSource.getEvents", () => {
	it("쿼리스트링 포함 GET 요청을 보내고 JSON을 반환한다", async () => {
		const payload = [{ id: "evt-1" }];
		const fetchMock = stubFetchJson(payload);

		const result = await new EventDataSource().getEvents(
			"2026-06-01T00:00:00+09:00",
			"2026-06-30T23:59:59+09:00",
		);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(
			"/api/events?startDate=2026-06-01T00%3A00%3A00%2B09%3A00&endDate=2026-06-30T23%3A59%3A59%2B09%3A00",
		);
		expect(init?.method).toBe("GET");
		expect(result).toEqual(payload);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(500, "Internal Server Error");
		await expect(
			new EventDataSource().getEvents("a", "b"),
		).rejects.toThrow("Failed to fetch events: 500 Internal Server Error");
	});
});

describe("EventDataSource.createEvent", () => {
	it("POST로 body를 직렬화해 보내고 생성 결과를 반환한다", async () => {
		const created = { id: "created" };
		const fetchMock = stubFetchJson(created);
		const request = {
			title: "데이트",
			startTime: "2026-06-06T10:00:00.000Z",
			endTime: "2026-06-06T12:00:00.000Z",
			category: "DATE" as const,
			description: null,
			location: null,
		};

		const result = await new EventDataSource().createEvent(request);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/events");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual(request);
		expect(result).toEqual(created);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(400, "Bad Request");
		await expect(
			new EventDataSource().createEvent({
				title: "x",
				startTime: "a",
				endTime: "b",
				category: "DATE",
				description: null,
				location: null,
			}),
		).rejects.toThrow("Failed to create event: 400 Bad Request");
	});
});

describe("EventDataSource.updateEvent", () => {
	it("PATCH로 부분 업데이트 body를 보내고 갱신 결과를 반환한다", async () => {
		const updated = { id: "evt-1", title: "수정됨" };
		const fetchMock = stubFetchJson(updated);
		const request = { title: "수정됨" };

		const result = await new EventDataSource().updateEvent("evt-1", request);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/events/evt-1");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual(request);
		expect(result).toEqual(updated);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(404, "Not Found");
		await expect(new EventDataSource().updateEvent("missing", { title: "x" })).rejects.toThrow(
			"Failed to update event: 404 Not Found",
		);
	});
});

describe("EventDataSource.deleteEvent", () => {
	it("DELETE 요청을 보내고 204 빈 본문이어도 json()을 호출하지 않는다", async () => {
		const fetchMock = stubFetchJson(null, { status: 204 });

		await expect(new EventDataSource().deleteEvent("evt-1")).resolves.toBeUndefined();

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/events/evt-1");
		expect(init?.method).toBe("DELETE");
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(404, "Not Found");
		await expect(new EventDataSource().deleteEvent("missing")).rejects.toThrow(
			"Failed to delete event: 404 Not Found",
		);
	});
});
