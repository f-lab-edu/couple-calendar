"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { coupleRepository } from "@/composition/couple";
import InviteCode from "@/domain/entities/InviteCode";
import useGenerateInviteCode from "@/presentation/onboarding/hooks/useGenerateInviteCode";

const COPIED_FEEDBACK_MS = 1500;

/**
 * 초대 코드 생성 화면(온보딩)의 뷰모델.
 * 시작일 선택 → 코드 생성 → 코드 복사(피드백 토스트 1.5초)까지의 상태/동작을 담당한다.
 *
 * 이미 초대만 만든(파트너 대기) 계정은 백엔드가 재생성을 400("already in a couple")으로
 * 막으므로, 진입 시 내 커플을 조회해 유효한 기존 코드가 있으면 그대로 보여준다.
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

	// 진입 시 기존 커플 조회. 커플이 없으면 404 등으로 에러 → 신규 생성 흐름으로 진행.
	const existing = useQuery({
		queryKey: ["myCouple", "codeGen"],
		queryFn: () => coupleRepository.getMyCouple(),
		retry: false,
		staleTime: 0,
		// 파트너 대기(미완성 커플) 동안 4초마다 연결 여부를 확인한다. 연결되면(완성) 폴링 중단.
		refetchInterval: (query) => {
			const couple = query.state.data;
			return couple && !couple.isComplete ? 4000 : false;
		},
	});

	// 코드 발급 직후, 갓 생성된 커플(파트너 대기)을 불러와 폴링을 시작시킨다.
	useEffect(() => {
		if (generate.isSuccess) existing.refetch();
	}, [generate.isSuccess, existing.refetch]);

	// 상대가 코드를 입력해 연결이 완성되면 자동으로 홈으로 이동(화면에 적힌 약속대로).
	useEffect(() => {
		if (existing.data?.isComplete) router.replace("/home");
	}, [existing.data?.isComplete, router]);

	// 파트너 대기(미완성) + 아직 만료되지 않은 코드만 "기존 코드"로 인정한다.
	const existingInvite = useMemo(() => {
		const couple = existing.data;
		if (!couple || couple.isComplete) return null;
		if (!couple.inviteCode || !couple.inviteCodeExpiresAt) return null;
		if (Date.parse(couple.inviteCodeExpiresAt) <= Date.now()) return null;
		return new InviteCode(couple.inviteCode, couple.inviteCodeExpiresAt);
	}, [existing.data]);

	// 표시할 코드: 방금 생성한 것 우선, 없으면 기존 유효 코드.
	const invite = generate.data ?? existingInvite;
	// 시작일 라벨: 입력값 우선, 없으면 기존 커플의 시작일(생성 폼을 건너뛴 경우).
	const effectiveStartDate = startDate || existing.data?.startDate?.slice(0, 10) || "";

	// 입력값이 비어 있으면 기존 커플의 시작일을 그대로 쓴다.
	// (버튼의 활성/표시는 effectiveStartDate 기준이므로 생성도 같은 값을 써야 no-op이 안 생긴다.)
	const generateCode = () => {
		if (!effectiveStartDate) return;
		generate.mutate(effectiveStartDate);
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
		startDate: effectiveStartDate,
		setStartDate,
		invite,
		// 기존 커플 조회 중에는 폼/코드 판단을 미루기 위해 로딩으로 본다.
		loading: existing.isLoading,
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
