"use client";

import { SettingsHeader } from "@/presentation/settings/components/SettingsHeader";

interface Props {
	title: string;
	onSave: () => void;
	saveDisabled: boolean;
	saving: boolean;
}

/**
 * 설정 편집 화면 공통 헤더(뒤로가기 + 제목 + 저장 pill).
 * 프로필/상대방/알림 편집 화면이 동일한 헤더를 공유한다.
 */
export const SettingsEditHeader = ({ title, onSave, saveDisabled, saving }: Props) => (
	<SettingsHeader
		title={title}
		right={
			<button
				type="button"
				onClick={onSave}
				disabled={saveDisabled || saving}
				className="wb-btn wb-btn--primary wb-btn--sm"
				style={{ opacity: saveDisabled || saving ? 0.5 : 1 }}
			>
				{saving ? "저장 중…" : "저장"}
			</button>
		}
	/>
);
