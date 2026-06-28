"use client";

import type Anniversary from "@/domain/entities/Anniversary";
import { formatDday } from "@/presentation/anniversaries/lib/anniversaryDisplay";
import { formatKoreanDate } from "@/shared/lib/date";

interface Props {
	anniversary: Anniversary;
	onPress: (anniversary: Anniversary) => void;
}

/**
 * 기념일 목록의 한 행. 탭하면 상세 시트를 연다.
 * AUTO/CUSTOM 구분 배지를 보여주되, 편집 가능 여부는 상세 시트에서 강제한다.
 */
const AnniversaryListItem = ({ anniversary, onPress }: Props) => (
	<button
		type="button"
		onClick={() => onPress(anniversary)}
		className="wb-card dark-cell flex w-full items-center justify-between gap-3 text-left"
		style={{ minHeight: 64, padding: "14px 16px" }}
	>
		<div className="flex min-w-0 flex-col gap-0.5">
			<div className="flex items-center gap-2">
				<span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-brand)" }}>{anniversary.title}</span>
				{anniversary.type === "AUTO" ? (
					<span
						className="rounded-full px-2 py-0.5"
						style={{ fontSize: 11, background: "rgba(255,255,255,0.08)", color: "var(--text-tertiary)" }}
					>
						자동
					</span>
				) : null}
			</div>
			<span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
				{formatKoreanDate(anniversary.date)}
				{anniversary.isRecurring ? " · 매년" : ""}
			</span>
		</div>
		<span style={{ fontSize: 14, fontWeight: 600, color: "var(--action-primary)", flexShrink: 0 }}>
			{formatDday(anniversary.daysUntil)}
		</span>
	</button>
);

export default AnniversaryListItem;
