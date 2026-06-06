"use client";

import { Button, Text } from "woosign-system";
import { BackButton } from "@/presentation/settings/components/BackButton";

interface Props {
	title: string;
	onSave: () => void;
	saveDisabled: boolean;
	saving: boolean;
}

/**
 * 설정 편집 화면 공통 헤더(뒤로가기 + 제목 + 저장 버튼).
 * 프로필/상대방/알림 편집 화면이 동일한 헤더를 공유한다.
 */
export const SettingsEditHeader = ({ title, onSave, saveDisabled, saving }: Props) => (
	<header className="flex items-center justify-between px-3 pt-4 pb-3 bg-white">
		<div className="flex items-center gap-2">
			<BackButton />
			<Text as="h1" variant="p" weight="semibold" style={{ lineHeight: "24px", fontSize: 18 }}>
				{title}
			</Text>
		</div>
		<Button
			variant="default"
			size="sm"
			disabled={saveDisabled}
			loading={saving}
			onPress={onSave}
			style={{ borderRadius: 999 }}
		>
			저장
		</Button>
	</header>
);
