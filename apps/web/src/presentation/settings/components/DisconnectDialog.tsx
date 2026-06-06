"use client";

import { Button, Text } from "woosign-system";

interface Props {
	open: boolean;
	loading?: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}

/**
 * 연결 끊기 확인 다이얼로그.
 * woosign-system에 Modal이 없어 오버레이 + 패널을 직접 구성한다.
 */
export const DisconnectDialog = ({ open, loading = false, onCancel, onConfirm }: Props) => {
	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
			role="dialog"
			aria-modal="true"
			aria-label="연결 끊기 확인"
		>
			<div className="w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-xl">
				<Text as="h2" variant="p" weight="semibold" style={{ fontSize: 17, lineHeight: "24px", color: "#111827" }}>
					연결을 끊을까요?
				</Text>
				<Text as="p" variant="small" style={{ marginTop: 8, lineHeight: "20px", color: "#6b7280" }}>
					연결을 끊으면 공유된 일정과 기념일을 더 이상 함께 볼 수 없어요. 이 작업은 되돌릴 수 없어요.
				</Text>

				<div className="mt-5 flex gap-2">
					<Button variant="secondary" fullWidth disabled={loading} onPress={onCancel}>
						취소
					</Button>
					<Button variant="destructive" fullWidth loading={loading} onPress={onConfirm}>
						연결 끊기
					</Button>
				</div>
			</div>
		</div>
	);
};
