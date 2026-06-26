"use client";

import { createPortal } from "react-dom";
import { ChevronIcon, CopyIcon } from "@/presentation/components/icons";
import LogoutLink from "@/presentation/onboarding/components/LogoutLink";
import useInviteCodeGen from "@/presentation/onboarding/hooks/useInviteCodeGen";
import { formatKoreanDate } from "@/shared/lib/date";

const formatCode = (code: string) => code.match(/.{1,2}/g)?.join(" ") ?? code;

/** 만료까지 남은 시간 라벨. */
const remainingLabel = (expiresAt: string): string => {
	const ms = Date.parse(expiresAt) - Date.now();
	if (ms <= 0) return "만료됨 — 새 코드를 만들어 주세요";
	const hours = Math.floor(ms / 3_600_000);
	const minutes = Math.floor((ms % 3_600_000) / 60_000);
	return hours > 0 ? `${hours}시간 ${minutes}분 후 만료` : `${minutes}분 후 만료`;
};

const CodeGenPage = () => {
	const {
		today,
		startDate,
		setStartDate,
		invite,
		loading,
		mounted,
		copied,
		generateCode,
		copyCode,
		shareCode,
		goBack,
		generating,
		generateError,
	} = useInviteCodeGen();

	return (
		<div
			className="wb-page flex flex-col"
			style={{
				minHeight: "100dvh",
				padding:
					"calc(env(safe-area-inset-top) + 12px) 24px calc(env(safe-area-inset-bottom) + 28px)",
			}}
		>
			<LogoutLink />
			<button
				type="button"
				aria-label="뒤로 가기"
				className="-ml-2 mb-2 flex items-center"
				onClick={goBack}
				style={{
					alignSelf: "flex-start",
					background: "none",
					border: "none",
					color: "var(--text-secondary)",
					cursor: "pointer",
					padding: 8,
				}}
			>
				<ChevronIcon s={20} dir="left" />
			</button>

			{loading ? (
				<div className="flex flex-1 items-center justify-center">
					<div className="wb-body-sm" style={{ color: "var(--text-tertiary)" }}>
						불러오는 중…
					</div>
				</div>
			) : invite ? (
				<>
					<div style={{ marginTop: 8 }}>
						<div
							style={{
								fontSize: 22,
								fontWeight: 600,
								letterSpacing: "var(--ls-display)",
								color: "var(--text-brand)",
							}}
						>
							상대방에게 이 코드를 알려주세요.
						</div>
						<div className="wb-body-sm" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
							{formatKoreanDate(startDate)}부터 시작 · 24시간 동안 유효해요.
						</div>
					</div>

					<div
						style={{
							marginTop: 36,
							background: "var(--bg-card)",
							borderRadius: "var(--radius-lg)",
							padding: "32px 24px",
							boxShadow: "var(--shadow-card)",
							textAlign: "center",
						}}
					>
						<div
							style={{
								fontSize: 11,
								fontWeight: 600,
								letterSpacing: 1.2,
								textTransform: "uppercase",
								color: "var(--action-primary)",
							}}
						>
							INVITE CODE
						</div>
						<div
							style={{
								marginTop: 14,
								fontFamily: "var(--font-sans)",
								fontSize: 44,
								fontWeight: 700,
								letterSpacing: 6,
								color: "var(--text-brand)",
								fontVariantNumeric: "tabular-nums",
							}}
						>
							{formatCode(invite.code)}
						</div>
						<div className="wb-caption" style={{ marginTop: 10, color: "var(--text-tertiary)" }}>
							{remainingLabel(invite.expiresAt)}
						</div>
						<div className="flex items-center justify-center" style={{ marginTop: 16, gap: 8 }}>
							<button
								type="button"
								onClick={copyCode}
								className="wb-btn wb-btn--secondary wb-btn--sm"
								style={{ gap: 6 }}
							>
								<CopyIcon s={14} /> {copied ? "복사 완료" : "코드 복사"}
							</button>
							<button
								type="button"
								onClick={shareCode}
								className="wb-btn wb-btn--primary wb-btn--sm"
								style={{ gap: 6 }}
							>
								공유하기
							</button>
						</div>
					</div>

					<div
						className="flex items-center justify-center"
						style={{ marginTop: 18, gap: 8, color: "var(--text-secondary)" }}
					>
						<span className="animate-pulse" aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--action-primary)" }} />
						<span className="wb-body-sm">상대방 연결을 기다리는 중…</span>
					</div>

					<div
						style={{
							marginTop: 16,
							padding: 14,
							background: "var(--cream-200)",
							borderRadius: "var(--radius-md)",
						}}
					>
						<div className="wb-caption" style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
							• 상대방이 코드를 입력하면 자동으로 연결됩니다.
							<br />• 코드는 다른 사람에게 노출되지 않게 주의해주세요.
						</div>
					</div>
				</>
			) : (
				<>
					<div style={{ marginTop: 8 }}>
						<div
							style={{
								fontSize: 22,
								fontWeight: 600,
								letterSpacing: "var(--ls-display)",
								color: "var(--text-brand)",
							}}
						>
							언제부터 시작했나요?
						</div>
						<div className="wb-body-sm" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
							두 사람이 시작한 날을 선택하면 초대 코드를 만들어 드려요.
						</div>
					</div>

					<div style={{ marginTop: 28 }}>
						<div
							style={{
								fontSize: 12,
								fontWeight: 600,
								letterSpacing: 0.6,
								textTransform: "uppercase",
								color: "var(--text-secondary)",
								marginBottom: 8,
							}}
						>
							우리 시작일
						</div>
						<input
							type="date"
							className="wb-input"
							value={startDate}
							max={today}
							onChange={(event) => setStartDate(event.target.value)}
							style={{ colorScheme: "dark" }}
						/>
					</div>

					{generateError && (
						<div className="wb-body-sm" style={{ marginTop: 8, color: "var(--error-red)", lineHeight: 1.5 }}>
							{generateError}
						</div>
					)}

					<div style={{ flex: 1 }} />

					<button
						type="button"
						disabled={!startDate || generating}
						onClick={generateCode}
						className="wb-btn wb-btn--primary wb-btn--lg"
						style={{
							width: "100%",
							justifyContent: "center",
							opacity: !startDate || generating ? 0.5 : 1,
						}}
					>
						{generating ? "만드는 중..." : "초대 코드 만들기"}
					</button>
				</>
			)}

			{mounted && copied
				? createPortal(
						<div
							className="wb-toast"
							style={{
								position: "fixed",
								left: "50%",
								bottom: 32,
								transform: "translateX(-50%)",
								zIndex: 9999,
								pointerEvents: "none",
							}}
						>
							<span style={{ color: "var(--action-primary)", fontWeight: 700 }}>♥</span>
							<span style={{ fontSize: 14, fontWeight: 600 }}>초대 코드를 복사했어요.</span>
						</div>,
						document.body,
					)
				: null}
		</div>
	);
};

export default CodeGenPage;
