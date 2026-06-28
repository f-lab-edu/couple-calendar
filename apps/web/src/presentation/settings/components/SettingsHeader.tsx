"use client";

import type { ReactNode } from "react";
import { BackButton } from "@/presentation/settings/components/BackButton";

interface Props {
	title: string;
	/** 우측 슬롯(저장 pill 등). */
	right?: ReactNode;
}

/**
 * 설정 화면 공통 헤더(뒤로가기 chevron + 제목 + 우측 슬롯).
 * 설정 메인과 하위 화면이 동일한 다크 헤더를 공유한다.
 */
export const SettingsHeader = ({ title, right }: Props) => (
	<header
		className="flex items-center gap-1 pt-[calc(env(safe-area-inset-top)_+_0.5rem)] pr-3 pb-3 pl-1"
		style={{
			background: "#1a1a1c",
			borderBottom: "1px solid rgba(255,255,255,0.08)",
		}}
	>
		<BackButton />
		<h1
			className="flex-1"
			style={{ fontSize: 16, fontWeight: 600, letterSpacing: "var(--ls-display)", color: "var(--text-brand)" }}
		>
			{title}
		</h1>
		{right}
	</header>
);
