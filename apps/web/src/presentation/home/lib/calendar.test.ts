import { describe, expect, it } from "vitest";
import { eventCoversLocalDay } from "./calendar";

// KST(+09:00) 기준 ISO 로 이벤트 구간을 만든다(앱이 KST 앵커를 쓴다).
const kst = (s: string) => `${s}+09:00`;

describe("eventCoversLocalDay", () => {
	// 2026-06: 6/10 ~ 6/12 (2박3일) 여행. 시작·중간·끝 모두 덮어야 한다.
	const start = kst("2026-06-10T14:00:00");
	const end = kst("2026-06-12T11:00:00");

	it("시작일을 덮는다", () => {
		expect(eventCoversLocalDay(start, end, 2026, 5, 10)).toBe(true);
	});

	it("중간 날도 덮는다 (기존 버그: 시작일만 보던 문제)", () => {
		expect(eventCoversLocalDay(start, end, 2026, 5, 11)).toBe(true);
	});

	it("마지막 날도 덮는다", () => {
		expect(eventCoversLocalDay(start, end, 2026, 5, 12)).toBe(true);
	});

	it("기간 밖(시작 전날)은 덮지 않는다", () => {
		expect(eventCoversLocalDay(start, end, 2026, 5, 9)).toBe(false);
	});

	it("기간 밖(종료 다음날)은 덮지 않는다", () => {
		expect(eventCoversLocalDay(start, end, 2026, 5, 13)).toBe(false);
	});

	it("종일/하루 일정은 해당 날만 덮는다", () => {
		const s = kst("2026-06-15T00:00:00");
		const e = kst("2026-06-15T23:59:59");
		expect(eventCoversLocalDay(s, e, 2026, 5, 14)).toBe(false);
		expect(eventCoversLocalDay(s, e, 2026, 5, 15)).toBe(true);
		expect(eventCoversLocalDay(s, e, 2026, 5, 16)).toBe(false);
	});

	it("월 경계를 넘는 일정은 양쪽 달의 해당 날을 덮는다", () => {
		const s = kst("2026-05-30T10:00:00");
		const e = kst("2026-06-02T10:00:00");
		expect(eventCoversLocalDay(s, e, 2026, 4, 31)).toBe(true); // 5/31
		expect(eventCoversLocalDay(s, e, 2026, 5, 1)).toBe(true); // 6/1
		expect(eventCoversLocalDay(s, e, 2026, 5, 2)).toBe(true); // 6/2
		expect(eventCoversLocalDay(s, e, 2026, 5, 3)).toBe(false); // 6/3
	});

	it("잘못된 날짜 문자열은 false", () => {
		expect(eventCoversLocalDay("nope", end, 2026, 5, 11)).toBe(false);
	});
});
