"use client";

import { Text } from "woosign-system";
import { SettingsHeader } from "@/presentation/settings/components/SettingsHeader";

interface Props {
	title: string;
	description?: string;
}

/**
 * 아직 구현되지 않은 설정 하위 화면용 자리표시 스크린.
 * 헤더(뒤로가기 + 제목)와 안내 문구만 제공한다.
 */
export const PlaceholderScreen = ({ title, description = "곧 추가될 화면이에요." }: Props) => {
	return (
		<div className="flex flex-col min-h-[100dvh] bg-white">
			<SettingsHeader title={title} />

			<div className="flex flex-1 items-center justify-center px-6">
				<Text as="p" variant="small" style={{ lineHeight: "20px", color: "#9ca3af" }}>
					{description}
				</Text>
			</div>
		</div>
	);
};
