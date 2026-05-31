"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Card, colors, Eyebrow, Text, Toast } from "woosign-system";
import useGenerateInviteCode from "@/presentation/onboarding/hooks/useGenerateInviteCode";
import ChevronLeft from "@/shared/components/icon/ChevronLeft";
import CopyIcon from "@/shared/components/icon/CopyIcon";
import { formatKoreanDate } from "@/shared/lib/date";

const COPIED_FEEDBACK_MS = 1500;

const formatCode = (code: string) => code.match(/.{1,2}/g)?.join(" ") ?? code;

const CodeGenPage = () => {
	const router = useRouter();
	const generate = useGenerateInviteCode();
	const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

	const [startDate, setStartDate] = useState("");
	const [copied, setCopied] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!copied) return;
		const timerId = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
		return () => window.clearTimeout(timerId);
	}, [copied]);

	const invite = generate.data ?? null;

	const handleGenerate = () => {
		if (!startDate) return;
		generate.mutate(startDate);
	};

	const handleCopyCode = async () => {
		if (!invite) return;
		try {
			await navigator.clipboard.writeText(invite.code);
			setCopied(true);
		} catch {
			window.alert("코드 복사에 실패했어요. 다시 시도해 주세요.");
		}
	};

	return (
		<div className="flex flex-col min-h-[100dvh] px-5 pt-3 pb-6 bg-white">
			<button
				type="button"
				aria-label="뒤로 가기"
				className="-ml-2 mb-2 flex h-10 w-10 items-center justify-center"
				onClick={() => router.back()}
			>
				<ChevronLeft />
			</button>

			{invite ? (
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
							onPress={handleCopyCode}
							style={{ marginTop: 20, borderRadius: 999 }}
						>
							{copied ? "복사 완료" : "코드 복사"}
						</Button>
					</Card>

					<Card variant="warm" fullWidth style={{ marginTop: 20, borderRadius: 12, padding: "12px 16px" }}>
						<ul className="space-y-0.5">
							<li className="flex gap-2">
								<span style={{ color: "#6b7280" }}>•</span>
								<Text as="span" variant="small" style={{ fontSize: 13, lineHeight: "20px", color: colors.textTertiary }}>
									상대방이 코드를 입력하면 자동으로 연결됩니다.
								</Text>
							</li>
							<li className="flex gap-2">
								<span style={{ color: "#6b7280" }}>•</span>
								<Text as="span" variant="small" style={{ fontSize: 13, lineHeight: "20px", color: colors.textTertiary }}>
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

					{generate.isError && (
						<Text as="p" variant="small" style={{ marginTop: 8, color: "#dc2626", lineHeight: "20px" }}>
							{generate.error?.message ?? "초대 코드 생성에 실패했어요. 다시 시도해 주세요."}
						</Text>
					)}

					<div className="mt-auto pt-6">
						<Button
							size="lg"
							fullWidth
							disabled={!startDate || generate.isPending}
							loading={generate.isPending}
							onPress={handleGenerate}
						>
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
