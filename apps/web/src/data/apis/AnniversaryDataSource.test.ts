import { describe, expect, it } from "vitest";
import { stubFetchError, stubFetchJson } from "@/test/mockFetch";
import { AnniversaryDataSource } from "./AnniversaryDataSource";

describe("AnniversaryDataSource.getAnniversaries", () => {
	it("GET 요청을 보내고 JSON 배열을 반환한다", async () => {
		const payload = [{ id: "a-1" }];
		const fetchMock = stubFetchJson(payload);

		const result = await new AnniversaryDataSource().getAnniversaries();

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/anniversaries");
		expect(init?.method).toBe("GET");
		expect(result).toEqual(payload);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(500, "Internal Server Error");
		await expect(new AnniversaryDataSource().getAnniversaries()).rejects.toThrow(
			"Failed to fetch anniversaries: 500 Internal Server Error",
		);
	});
});

describe("AnniversaryDataSource.addAnniversary", () => {
	it("POST로 body를 직렬화해 보내고 생성 결과를 반환한다", async () => {
		const created = { id: "created" };
		const fetchMock = stubFetchJson(created, { status: 201 });
		const request = {
			title: "100일",
			date: "2025-04-10",
			isRecurring: false,
			description: null,
		};

		const result = await new AnniversaryDataSource().addAnniversary(request);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/anniversaries");
		expect(init?.method).toBe("POST");
		expect(JSON.parse(init?.body as string)).toEqual(request);
		expect(result).toEqual(created);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(400, "Bad Request");
		await expect(
			new AnniversaryDataSource().addAnniversary({ title: "x", date: "2025-01-01" }),
		).rejects.toThrow("Failed to create anniversary: 400 Bad Request");
	});
});

describe("AnniversaryDataSource.updateAnniversary", () => {
	it("PATCH로 부분 업데이트 body를 보내고 갱신 결과를 반환한다", async () => {
		const updated = { id: "a-1", title: "수정됨" };
		const fetchMock = stubFetchJson(updated);
		const request = { title: "수정됨" };

		const result = await new AnniversaryDataSource().updateAnniversary("a-1", request);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/anniversaries/a-1");
		expect(init?.method).toBe("PATCH");
		expect(JSON.parse(init?.body as string)).toEqual(request);
		expect(result).toEqual(updated);
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(404, "Not Found");
		await expect(
			new AnniversaryDataSource().updateAnniversary("missing", { title: "x" }),
		).rejects.toThrow("Failed to update anniversary: 404 Not Found");
	});
});

describe("AnniversaryDataSource.deleteAnniversary", () => {
	it("DELETE 요청을 보내고 204 빈 본문이어도 json()을 호출하지 않는다", async () => {
		const fetchMock = stubFetchJson(null, { status: 204 });

		await expect(new AnniversaryDataSource().deleteAnniversary("a-1")).resolves.toBeUndefined();

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe("/api/anniversaries/a-1");
		expect(init?.method).toBe("DELETE");
	});

	it("응답이 ok가 아니면 에러를 던진다", async () => {
		stubFetchError(400, "Bad Request");
		await expect(new AnniversaryDataSource().deleteAnniversary("auto-1")).rejects.toThrow(
			"Failed to delete anniversary: 400 Bad Request",
		);
	});
});
