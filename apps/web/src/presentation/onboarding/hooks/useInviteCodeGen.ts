"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import useGenerateInviteCode from "@/presentation/onboarding/hooks/useGenerateInviteCode";

const COPIED_FEEDBACK_MS = 1500;

/**
 * 초대 코드 생성 화면(온보딩)의 뷰모델.
 * 시작일 선택 → 코드 생성 → 코드 복사(피드백 토스트 1.5초)까지의 상태/동작을 담당한다.
 */
const useInviteCodeGen = () => {
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

	const generateCode = () => {
		if (!startDate) return;
		generate.mutate(startDate);
	};

	const copyCode = async () => {
		if (!invite) return;
		try {
			await navigator.clipboard.writeText(invite.code);
			setCopied(true);
		} catch {
			window.alert("코드 복사에 실패했어요. 다시 시도해 주세요.");
		}
	};

	return {
		today,
		startDate,
		setStartDate,
		invite,
		mounted,
		copied,
		generateCode,
		copyCode,
		goBack: () => router.back(),
		generating: generate.isPending,
		generateError: generate.isError
			? (generate.error?.message ?? "초대 코드 생성에 실패했어요. 다시 시도해 주세요.")
			: undefined,
	};
};

export default useInviteCodeGen;
