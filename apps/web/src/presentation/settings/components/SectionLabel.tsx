"use client";

import { Text } from "woosign-system";

/**
 * 설정 화면 섹션 구분용 라벨(연한 회색 소제목).
 */
export const SectionLabel = ({ children }: { children: string }) => (
	<Text as="p" variant="small" weight="semibold" style={{ padding: "16px 20px 8px", fontSize: 13, color: "#9ca3af" }}>
		{children}
	</Text>
);
