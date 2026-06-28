"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoupleProfileUseCase } from "@/composition/settings";
import type { CoupleProfile } from "@/domain/useCases/GetCoupleProfileUseCase";

/**
 * 설정 화면의 커플 프로필(나/파트너/커플)을 로드한다.
 */
const useCoupleProfile = () =>
	useQuery<CoupleProfile>({
		queryKey: ["coupleProfile"],
		queryFn: () => getCoupleProfileUseCase.execute(),
		// 401(인증 만료)은 재시도해도 의미 없으니 즉시 실패시켜 가드가 바로 로그인으로 보낸다.
		// (재시도하면 그동안 홈이 빈 화면으로 멈춰 흰 화면처럼 보인다.)
		retry: (count, error) => !(error instanceof Error && /\b401\b/.test(error.message)) && count < 2,
	});

export default useCoupleProfile;
