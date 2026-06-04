"use client";

import { Text } from "woosign-system";
import { BackButton } from "@/presentation/settings/components/BackButton";

interface Props {
	title: string;
}

/**
 * 설정 화면 공통 헤더(뒤로가기 버튼 + 제목).
 * 설정 메인과 자리표시 하위 화면이 동일한 헤더를 공유한다.
 */
export const SettingsHeader = ({ title }: Props) => (
	<header className="flex items-center gap-2 px-3 pt-4 pb-3">
		<BackButton />
		<Text as="h1" variant="p" weight="semibold" style={{ lineHeight: "24px", fontSize: 18 }}>
			{title}
		</Text>
	</header>
);
