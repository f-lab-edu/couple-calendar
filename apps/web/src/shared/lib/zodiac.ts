interface ZodiacRange {
	/** 이 구간의 시작(이 월/일 이상이면 해당). [month, day] */
	from: [number, number];
	sign: string;
}

// 각 별자리의 시작일. 마지막(염소)이 연말~연초를 감싸므로 매칭은 역순으로 한다.
const ZODIAC_RANGES: ZodiacRange[] = [
	{ from: [1, 20], sign: "물병자리" },
	{ from: [2, 19], sign: "물고기자리" },
	{ from: [3, 21], sign: "양자리" },
	{ from: [4, 20], sign: "황소자리" },
	{ from: [5, 21], sign: "쌍둥이자리" },
	{ from: [6, 22], sign: "게자리" },
	{ from: [7, 23], sign: "사자자리" },
	{ from: [8, 23], sign: "처녀자리" },
	{ from: [9, 23], sign: "천칭자리" },
	{ from: [10, 24], sign: "전갈자리" },
	{ from: [11, 23], sign: "사수자리" },
	{ from: [12, 22], sign: "염소자리" },
];

/**
 * ISO 날짜("1995-11-02")에서 서양 별자리를 구한다.
 * 12/22~1/19는 염소자리.
 */
export const zodiacSign = (isoDate: string): string => {
	const [, monthStr, dayStr] = isoDate.slice(0, 10).split("-");
	const month = Number(monthStr);
	const day = Number(dayStr);

	for (let i = ZODIAC_RANGES.length - 1; i >= 0; i -= 1) {
		const { from, sign } = ZODIAC_RANGES[i];
		if (month > from[0] || (month === from[0] && day >= from[1])) {
			return sign;
		}
	}
	// 1/1 ~ 1/19
	return "염소자리";
};
