"use client";

import { Text } from "woosign-system";
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
		className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-4 py-4 text-left shadow-sm active:bg-neutral-50"
		style={{ minHeight: 64 }}
	>
		<div className="flex min-w-0 flex-col gap-0.5">
			<div className="flex items-center gap-2">
				<Text as="p" variant="p" weight="semibold" style={{ fontSize: 15, color: "#111827" }}>
					{anniversary.title}
				</Text>
				{anniversary.type === "AUTO" ? (
					<span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-500">
						자동
					</span>
				) : null}
			</div>
			<Text as="p" variant="muted" style={{ fontSize: 12, color: "#9CA3AF" }}>
				{formatKoreanDate(anniversary.date)}
				{anniversary.isRecurring ? " · 매년" : ""}
			</Text>
		</div>
		<Text as="p" variant="small" weight="semibold" style={{ color: "#ef6f5b", flexShrink: 0 }}>
			{formatDday(anniversary.daysUntil)}
		</Text>
	</button>
);

export default AnniversaryListItem;
