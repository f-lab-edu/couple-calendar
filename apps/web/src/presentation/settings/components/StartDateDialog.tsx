"use client";

import { useEffect, useState } from "react";

interface Props {
	open: boolean;
	initialDate: string;
	loading?: boolean;
	errorMessage?: string;
	onCancel: () => void;
	onConfirm: (startDate: string) => void;
}

/**
 * 커플 시작일 수정 다이얼로그(다크 모달).
 */
export const StartDateDialog = ({ open, initialDate, loading = false, errorMessage, onCancel, onConfirm }: Props) => {
	const [date, setDate] = useState(initialDate);
	const today = new Date().toISOString().slice(0, 10);

	// 다이얼로그가 열릴 때마다 현재 값으로 초기화.
	useEffect(() => {
		if (open) setDate(initialDate);
	}, [open, initialDate]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center px-6"
			style={{ background: "rgba(0,0,0,0.6)" }}
			role="dialog"
			aria-modal="true"
			aria-label="시작일 수정"
		>
			<div
				className="w-full max-w-[340px] p-6"
				style={{
					background: "#1a1a1c",
					border: "1px solid rgba(255,255,255,0.08)",
					borderRadius: "var(--radius-lg)",
					boxShadow: "var(--shadow-floating)",
				}}
			>
				<h2 style={{ fontSize: 17, fontWeight: 600, lineHeight: "24px", color: "var(--text-brand)" }}>
					우리 시작일
				</h2>
				<p className="wb-body-sm" style={{ marginTop: 8, lineHeight: "20px", color: "var(--text-secondary)" }}>
					두 사람이 시작한 날을 선택해 주세요. D-day가 함께 바뀌어요.
				</p>

				<input
					type="date"
					value={date}
					max={today}
					onChange={(event) => setDate(event.target.value)}
					className="wb-input"
					style={{ marginTop: 16 }}
				/>

				{errorMessage && (
					<p className="wb-body-sm" style={{ marginTop: 8, color: "var(--error-red)", lineHeight: "20px" }}>
						{errorMessage}
					</p>
				)}

				<div className="mt-5 flex gap-2">
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="wb-btn wb-btn--secondary wb-btn--lg"
						style={{ flex: 1 }}
					>
						취소
					</button>
					<button
						type="button"
						onClick={() => onConfirm(date)}
						disabled={!date || loading}
						className="wb-btn wb-btn--primary wb-btn--lg"
						style={{ flex: 1, opacity: !date || loading ? 0.5 : 1 }}
					>
						{loading ? "저장 중…" : "저장"}
					</button>
				</div>
			</div>
		</div>
	);
};
