"use client";

import { Row } from "@/presentation/settings/components/SettingsRows";

interface Props {
	label: string;
	value: string;
	valueMuted?: boolean;
	chevron?: boolean;
	onClick?: () => void;
}

/**
 * 읽기 전용 정보 행 (라벨 좌측 · 값 우측, 선택적 chevron).
 * 다크 Row 크롬을 재사용한다. chevron이 필요하면 onClick을 넘긴다.
 */
export const InfoRow = ({ label, value, valueMuted = false, chevron = false, onClick }: Props) => (
	<Row label={label} value={value} valueMuted={valueMuted} onClick={chevron ? (onClick ?? (() => {})) : undefined} />
);
