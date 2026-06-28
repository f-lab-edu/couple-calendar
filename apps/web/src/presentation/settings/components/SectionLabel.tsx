"use client";

/**
 * 설정 화면 섹션 구분용 라벨(대문자 tertiary 소제목).
 */
export const SectionLabel = ({ children }: { children: string }) => (
	<div
		style={{
			fontSize: 11,
			fontWeight: 700,
			letterSpacing: 0.6,
			textTransform: "uppercase",
			color: "var(--text-tertiary)",
			padding: "18px 20px 8px",
		}}
	>
		{children}
	</div>
);
