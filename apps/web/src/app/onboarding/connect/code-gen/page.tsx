"use client";

import { createPortal } from "react-dom";
import { Button, Card, colors, Eyebrow, Text, Toast } from "woosign-system";
import useInviteCodeGen from "@/presentation/onboarding/hooks/useInviteCodeGen";
import ChevronLeft from "@/shared/components/icon/ChevronLeft";
import CopyIcon from "@/shared/components/icon/CopyIcon";
import { formatKoreanDate } from "@/shared/lib/date";

const formatCode = (code: string) => code.match(/.{1,2}/g)?.join(" ") ?? code;

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
		goBack,
		generating,
		generateError,
	} = useInviteCodeGen();

	return (
		<div className="flex flex-col min-h-[100dvh] px-5 pt-[calc(env(safe-area-inset-top)_+_0.75rem)] pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)] bg-white">
			<button
				type="button"
				aria-label="뒤로 가기"
				className="-ml-2 mb-2 flex h-10 w-10 items-center justify-center"
				onClick={goBack}
			>
				<ChevronLeft />
			</button>

			{loading ? (
				<div className="flex flex-1 items-center justify-center">
					<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
						불러오는 중…
					</Text>
				</div>
			) : invite ? (
				<>
					<div className="mb-6">
						<Text as="h1" variant="h1" weight="bold" style={{ fontSize: 24, lineHeight: "32px", color: "#111827" }}>
							상대방에게 이 코드를 알려주세요.
						</Text>
						<Text as="p" variant="muted" style={{ marginTop: 6, fontSize: 14, lineHeight: "20px", color: "#6b7280" }}>
							{formatKoreanDate(startDate)}부터 시작 · 24시간 동안 유효해요.
						</Text>
					</div>

					<Card
						variant="default"
						fullWidth
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							borderRadius: 16,
							padding: "28px 20px",
						}}
					>
						<Eyebrow tone="brand">INVITE CODE</Eyebrow>
						<Text
							as="p"
							weight="bold"
							style={{
								marginTop: 12,
								fontSize: 40,
								lineHeight: "48px",
								letterSpacing: "0.04em",
								color: "#0f3a2d",
								fontVariantNumeric: "tabular-nums",
							}}
						>
							{formatCode(invite.code)}
						</Text>

						<Button
							variant="secondary"
							size="sm"
							leftIcon={<CopyIcon />}
							onPress={copyCode}
							style={{ marginTop: 20, borderRadius: 999 }}
						>
							{copied ? "복사 완료" : "코드 복사"}
						</Button>
					</Card>

					<Card variant="warm" fullWidth style={{ marginTop: 20, borderRadius: 12, padding: "12px 16px" }}>
						<ul className="space-y-0.5">
							<li className="flex gap-2">
								<span style={{ color: "#6b7280" }}>•</span>
								<Text
									as="span"
									variant="small"
									style={{ fontSize: 13, lineHeight: "20px", color: colors.textTertiary }}
								>
									상대방이 코드를 입력하면 자동으로 연결됩니다.
								</Text>
							</li>
							<li className="flex gap-2">
								<span style={{ color: "#6b7280" }}>•</span>
								<Text
									as="span"
									variant="small"
									style={{ fontSize: 13, lineHeight: "20px", color: colors.textTertiary }}
								>
									코드는 다른 사람에게 노출되지 않게 주의해주세요.
								</Text>
							</li>
						</ul>
					</Card>
				</>
			) : (
				<>
					<div className="mb-6">
						<Text as="h1" variant="h1" weight="bold" style={{ fontSize: 24, lineHeight: "32px", color: "#111827" }}>
							언제부터 시작했나요?
						</Text>
						<Text as="p" variant="muted" style={{ marginTop: 6, fontSize: 14, lineHeight: "20px", color: "#6b7280" }}>
							두 사람이 시작한 날을 선택하면 초대 코드를 만들어 드려요.
						</Text>
					</div>

					<label className="flex flex-col gap-2">
						<Text as="span" variant="small" weight="semibold" style={{ fontSize: 13, color: "#374151" }}>
							우리 시작일
						</Text>
						<input
							type="date"
							value={startDate}
							max={today}
							onChange={(event) => setStartDate(event.target.value)}
							className="rounded-xl border border-gray-200 px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
						/>
					</label>

					{generateError && (
						<Text as="p" variant="small" style={{ marginTop: 8, color: "#dc2626", lineHeight: "20px" }}>
							{generateError}
						</Text>
					)}

					<div className="mt-auto pt-6">
						<Button size="lg" fullWidth disabled={!startDate || generating} loading={generating} onPress={generateCode}>
							초대 코드 만들기
						</Button>
					</div>
				</>
			)}

			{mounted && copied
				? createPortal(
						<div
							style={{
								position: "fixed",
								left: "50%",
								bottom: 32,
								transform: "translateX(-50%)",
								zIndex: 9999,
								pointerEvents: "none",
							}}
						>
							<Toast tone="success" title="초대 코드를 복사했어요." />
						</div>,
						document.body,
					)
				: null}
		</div>
	);
};

export default CodeGenPage;
