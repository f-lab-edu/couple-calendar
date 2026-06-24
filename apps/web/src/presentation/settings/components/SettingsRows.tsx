"use client";

import type { ReactNode } from "react";
import { ChevronIcon } from "@/presentation/components/icons";

const ROW_STYLE = {
	background: "#1a1a1c",
	padding: "14px 16px",
	display: "flex",
	alignItems: "center",
	gap: 12,
	borderTop: "1px solid rgba(255,255,255,0.06)",
} as const;

/**
 * 44×26 다크 토글 (on=오렌지 / off=화이트 18%, 흰 노브 22px).
 */
export const Toggle = ({ on, onChange }: { on: boolean; onChange: (next: boolean) => void }) => (
	<button
		type="button"
		onClick={() => onChange(!on)}
		aria-pressed={on}
		style={{
			width: 44,
			height: 26,
			borderRadius: 13,
			padding: 2,
			border: "none",
			cursor: "pointer",
			background: on ? "var(--action-primary)" : "rgba(255,255,255,0.18)",
			transition: "background .15s ease",
			display: "flex",
			alignItems: "center",
			flexShrink: 0,
		}}
	>
		<span
			style={{
				width: 22,
				height: 22,
				borderRadius: "50%",
				background: "#fff",
				transform: on ? "translateX(18px)" : "translateX(0)",
				transition: "transform .15s ease",
				boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
			}}
		/>
	</button>
);

/**
 * 읽기 전용/이동 가능한 정보 행 (라벨 좌측 · 값/chevron 우측).
 */
export const Row = ({
	label,
	value,
	valueMuted = false,
	onClick,
	danger = false,
}: {
	label: string;
	value?: string;
	valueMuted?: boolean;
	onClick?: () => void;
	danger?: boolean;
}) => (
	<button
		type="button"
		onClick={onClick}
		disabled={!onClick}
		style={{
			...ROW_STYLE,
			width: "100%",
			textAlign: "left",
			border: "none",
			borderTop: "1px solid rgba(255,255,255,0.06)",
			cursor: onClick ? "pointer" : "default",
		}}
	>
		<span
			style={{
				flex: 1,
				minWidth: 0,
				fontSize: 14,
				fontWeight: 600,
				color: danger ? "var(--error-red)" : "var(--text-brand)",
			}}
		>
			{label}
		</span>
		{value && (
			<span
				style={{
					fontSize: 13,
					color: valueMuted ? "var(--text-tertiary)" : "var(--text-secondary)",
				}}
			>
				{value}
			</span>
		)}
		{onClick && <ChevronIcon s={14} style={{ color: "var(--text-tertiary)" }} />}
	</button>
);

/**
 * 토글이 달린 행 (라벨 + 보조 설명 + 우측 토글).
 */
export const ToggleRow = ({
	label,
	hint,
	on,
	onChange,
}: {
	label: string;
	hint?: string;
	on: boolean;
	onChange: (next: boolean) => void;
}) => (
	<div style={ROW_STYLE}>
		<div style={{ flex: 1, minWidth: 0 }}>
			<div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-brand)" }}>{label}</div>
			{hint && <div className="wb-caption" style={{ marginTop: 2 }}>{hint}</div>}
		</div>
		<Toggle on={on} onChange={onChange} />
	</div>
);

/**
 * 좌측 라벨 + 우측정렬 입력(또는 임의 children) 행.
 */
export const FieldRow = ({
	label,
	children,
	align = "center",
}: {
	label: string;
	children: ReactNode;
	align?: "center" | "start";
}) => (
	<div style={{ ...ROW_STYLE, alignItems: align === "start" ? "flex-start" : "center" }}>
		<span style={{ flexShrink: 0, fontSize: 14, color: "var(--text-secondary)" }}>{label}</span>
		<div className="flex flex-1 flex-col items-end">{children}</div>
	</div>
);
