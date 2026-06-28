import { describe, expect, it } from "vitest";
import Event from "@/domain/entities/Event";
import { searchEvents } from "./searchEvents";

const ev = (
	id: string,
	title: string,
	startTime: string,
	description: string | null = null,
	location: string | null = null,
): Event => new Event(id, "couple-1", title, startTime, startTime, "DATE", "me", description, location);

const events: Event[] = [
	ev("1", "제주 여행", "2026-06-10T09:00:00+09:00", "항공권 예약", "제주공항"),
	ev("2", "영화 보기", "2026-06-02T19:00:00+09:00", null, "CGV 강남"),
	ev("3", "Anniversary dinner", "2026-06-20T18:00:00+09:00", "제주産 흑돼지", null),
];

describe("searchEvents", () => {
	it("제목으로 찾는다", () => {
		expect(searchEvents(events, "여행").map((e) => e.id)).toEqual(["1"]);
	});

	it("장소로 찾는다", () => {
		expect(searchEvents(events, "cgv").map((e) => e.id)).toEqual(["2"]);
	});

	it("메모로 찾는다", () => {
		expect(searchEvents(events, "항공권").map((e) => e.id)).toEqual(["1"]);
	});

	it("대소문자를 무시한다", () => {
		expect(searchEvents(events, "ANNIVERSARY").map((e) => e.id)).toEqual(["3"]);
	});

	it("여러 건이 시작 시각 오름차순으로 정렬된다 ('제주'는 1·3에 매칭)", () => {
		expect(searchEvents(events, "제주").map((e) => e.id)).toEqual(["1", "3"]);
	});

	it("빈/공백 검색어는 빈 배열", () => {
		expect(searchEvents(events, "")).toEqual([]);
		expect(searchEvents(events, "   ")).toEqual([]);
	});

	it("매칭 없으면 빈 배열", () => {
		expect(searchEvents(events, "없는단어")).toEqual([]);
	});
});
