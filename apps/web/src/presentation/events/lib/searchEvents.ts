import type Event from "@/domain/entities/Event";

/** 검색 매칭용 정규화: 소문자 + 공백 정리. */
const norm = (s: string): string => s.toLowerCase().trim();

/**
 * 일정 목록을 검색어로 필터링한다. 제목·메모(description)·장소(location)에서
 * 대소문자 무시 부분일치로 찾고, 시작 시각 오름차순으로 정렬해 돌려준다.
 * 공백만 있거나 빈 검색어면 빈 배열(검색 전 상태)을 반환한다.
 */
export function searchEvents(events: Event[], query: string): Event[] {
	const q = norm(query);
	if (q.length === 0) return [];
	return events
		.filter((e) => {
			const haystack = [e.title, e.description ?? "", e.location ?? ""].map(norm);
			return haystack.some((h) => h.includes(q));
		})
		.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));
}
