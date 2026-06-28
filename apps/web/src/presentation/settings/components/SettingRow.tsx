"use client";

import { ChevronIcon } from "@/presentation/components/icons";

interface Props {
	title: string;
	description?: string;
	destructive?: boolean;
	onClick?: () => void;
}

export const SettingRow = ({ title, description, destructive = false, onClick }: Props) => (
	<button
		type="button"
		onClick={onClick}
		className="wb-card"
		style={{
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "14px 16px",
			textAlign: "left",
			width: "100%",
			cursor: onClick ? "pointer" : "default",
		}}
	>
		<div className="flex flex-col gap-1">
			<span
				style={{
					fontSize: 14,
					fontWeight: 600,
					lineHeight: "22px",
					color: destructive ? "var(--error-red)" : "var(--text-brand)",
				}}
			>
				{title}
			</span>
			{description && (
				<span className="wb-caption" style={{ lineHeight: "18px" }}>
					{description}
				</span>
			)}
		</div>
		<ChevronIcon s={16} style={{ color: destructive ? "var(--error-red)" : "var(--text-tertiary)" }} />
	</button>
);
