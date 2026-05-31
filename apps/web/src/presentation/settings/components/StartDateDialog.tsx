"use client";

import { useEffect, useState } from "react";
import { Button, Text } from "woosign-system";

interface Props {
	open: boolean;
	initialDate: string;
	loading?: boolean;
	errorMessage?: string;
	onCancel: () => void;
	onConfirm: (startDate: string) => void;
}

/**
 * 커플 시작일 수정 다이얼로그.
 * woosign-system에 Modal이 없어 오버레이 + 패널을 직접 구성한다.
 */
export const StartDateDialog = ({
	open,
	initialDate,
	loading = false,
	errorMessage,
	onCancel,
	onConfirm,
}: Props) => {
	const [date, setDate] = useState(initialDate);
	const today = new Date().toISOString().slice(0, 10);

	// 다이얼로그가 열릴 때마다 현재 값으로 초기화.
	useEffect(() => {
		if (open) setDate(initialDate);
	}, [open, initialDate]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
			role="dialog"
			aria-modal="true"
			aria-label="시작일 수정"
		>
			<div className="w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl">
				<Text as="h2" variant="p" weight="semibold" style={{ fontSize: 17, lineHeight: "24px", color: "#111827" }}>
					우리 시작일
				</Text>
				<Text as="p" variant="small" style={{ marginTop: 8, lineHeight: "20px", color: "#6b7280" }}>
					두 사람이 시작한 날을 선택해 주세요. D-day가 함께 바뀌어요.
				</Text>

				<input
					type="date"
					value={date}
					max={today}
					onChange={(event) => setDate(event.target.value)}
					className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
				/>

				{errorMessage && (
					<Text as="p" variant="small" style={{ marginTop: 8, color: "#dc2626", lineHeight: "20px" }}>
						{errorMessage}
					</Text>
				)}

				<div className="mt-5 flex gap-2">
					<Button variant="secondary" fullWidth disabled={loading} onPress={onCancel}>
						취소
					</Button>
					<Button
						variant="default"
						fullWidth
						loading={loading}
						disabled={!date}
						onPress={() => onConfirm(date)}
					>
						저장
					</Button>
				</div>
			</div>
		</div>
	);
};
