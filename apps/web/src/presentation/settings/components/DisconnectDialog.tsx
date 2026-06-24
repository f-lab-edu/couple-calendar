"use client";

import { useEffect, useState } from "react";

interface Props {
	open: boolean;
	loading?: boolean;
	/** 상대방 이름(있으면 제목에 사용). */
	partnerName?: string;
	onCancel: () => void;
	onConfirm: () => void;
}

const CONFIRM_PHRASE = "연결 끊기";

const LOST_ITEMS = ["함께 보던 공유 일정", "우리만의 기념일", "상대방 프로필과 별명", "연결된 커플 관계"];

/**
 * 연결 끊기 확인 다이얼로그(DisconnectScreen).
 * 빨강 broken-link 아이콘 + 사라지는 항목 리스트 + "연결 끊기" 타이핑 확인 + 빨강 버튼.
 * 타이핑 확인은 UI 가드이며, 실제 연결 끊기 동작(onConfirm)은 기존 훅 계약을 그대로 호출한다.
 */
export const DisconnectDialog = ({ open, loading = false, partnerName, onCancel, onConfirm }: Props) => {
	const [phrase, setPhrase] = useState("");

	useEffect(() => {
		if (open) setPhrase("");
	}, [open]);

	if (!open) return null;

	const matched = phrase.trim() === CONFIRM_PHRASE;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center px-6"
			style={{ background: "rgba(0,0,0,0.6)" }}
			role="dialog"
			aria-modal="true"
			aria-label="연결 끊기 확인"
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
				<div className="flex flex-col items-center text-center">
					<span
						className="flex items-center justify-center rounded-full"
						style={{ width: 72, height: 72, background: "rgba(176,40,24,0.10)", color: "var(--error-red)" }}
						aria-hidden
					>
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="연결 끊김">
							<title>연결 끊김</title>
							<path d="M9 17H7A5 5 0 0 1 7 7h2" />
							<path d="M15 7h2a5 5 0 0 1 4.5 7.2" />
							<path d="M8 12h3" />
							<path d="M2 2l20 20" />
						</svg>
					</span>
					<h2 style={{ marginTop: 16, fontSize: 17, fontWeight: 600, color: "var(--text-brand)" }}>
						{partnerName ? `${partnerName}과의 연결을 끊으시겠어요?` : "연결을 끊으시겠어요?"}
					</h2>
					<p className="wb-body-sm" style={{ marginTop: 8, color: "var(--text-secondary)", lineHeight: "20px" }}>
						이 작업은 되돌릴 수 없어요. 아래 항목을 더 이상 함께 볼 수 없습니다.
					</p>
				</div>

				<div
					className="mt-5 flex flex-col gap-2"
					style={{
						background: "#202023",
						border: "1px solid rgba(255,255,255,0.06)",
						borderRadius: "var(--radius-md)",
						padding: "14px 16px",
					}}
				>
					{LOST_ITEMS.map((item) => (
						<div key={item} className="flex items-center gap-2.5">
							<span
								style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--error-red)", flexShrink: 0 }}
								aria-hidden
							/>
							<span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{item}</span>
						</div>
					))}
				</div>

				<label
					htmlFor="disconnect-confirm"
					style={{ display: "block", marginTop: 18, fontSize: 13, color: "var(--text-secondary)" }}
				>
					계속하려면 <strong style={{ color: "var(--text-brand)" }}>{CONFIRM_PHRASE}</strong>를 입력하세요.
				</label>
				<input
					id="disconnect-confirm"
					type="text"
					value={phrase}
					placeholder={CONFIRM_PHRASE}
					onChange={(e) => setPhrase(e.target.value)}
					className="wb-input"
					style={{ marginTop: 8 }}
				/>

				<div className="mt-5 flex flex-col gap-2">
					<button
						type="button"
						onClick={onConfirm}
						disabled={!matched || loading}
						className="wb-btn wb-btn--danger wb-btn--lg"
						style={{ width: "100%", opacity: !matched || loading ? 0.5 : 1 }}
					>
						{loading ? "연결 끊는 중…" : "연결 끊기"}
					</button>
					<button
						type="button"
						onClick={onCancel}
						disabled={loading}
						className="wb-btn wb-btn--secondary wb-btn--lg"
						style={{ width: "100%" }}
					>
						취소
					</button>
				</div>
			</div>
		</div>
	);
};
