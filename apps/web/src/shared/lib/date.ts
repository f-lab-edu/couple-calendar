/**
 * ISO 날짜 문자열("2025-03-09")을 한국어 표기("2025년 3월 9일")로 변환.
 * 타임존 이슈를 피하려고 Date 파싱 없이 문자열을 직접 분해한다.
 */
export const formatKoreanDate = (isoDate: string): string => {
	const [year, month, day] = isoDate.slice(0, 10).split("-");
	return `${Number(year)}년 ${Number(month)}월 ${Number(day)}일`;
};

/**
 * ISO 날짜 문자열("1996-08-14")을 점 표기("1996.08.14")로 변환.
 */
export const formatBirthday = (isoDate: string): string => isoDate.slice(0, 10).split("-").join(".");
