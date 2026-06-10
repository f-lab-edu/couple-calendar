import type Anniversary from "@/domain/entities/Anniversary";

/**
 * `daysUntil` 값을 D-day 라벨로 변환한다.
 * - 0  → "D-DAY"
 * - 양수 → "D-{n}" (앞으로 n일)
 * - 음수 → "D+{n}" (지난 지 n일)
 */
export const formatDday = (daysUntil: number): string => {
	if (daysUntil === 0) return "D-DAY";
	if (daysUntil > 0) return `D-${daysUntil}`;
	return `D+${Math.abs(daysUntil)}`;
};

/** 오늘을 `yyyy-mm-dd`(호스트 로컬)로 — <input type="date"> 기본값용. */
export const todayDateString = (): string => {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

/**
 * 다가오는(아직 지나지 않은) 기념일 중 가장 가까운 것을 고른다.
 * `daysUntil >= 0` 중 최솟값. 없으면(전부 과거) 가장 최근에 지난 것을 반환한다.
 * 빈 목록이면 null.
 */
export const pickNearestUpcoming = (
	anniversaries: readonly Anniversary[],
): Anniversary | null => {
	if (anniversaries.length === 0) return null;
	const upcoming = anniversaries
		.filter((a) => a.daysUntil >= 0)
		.sort((a, b) => a.daysUntil - b.daysUntil);
	if (upcoming.length > 0) return upcoming[0];
	// 전부 과거라면 가장 최근(daysUntil이 0에 가장 가까운 음수)
	return [...anniversaries].sort((a, b) => b.daysUntil - a.daysUntil)[0];
};
