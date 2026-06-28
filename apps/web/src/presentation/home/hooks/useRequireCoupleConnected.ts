"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import { ROUTES } from "@/shared/constants/routes";

/**
 * /home 가드.
 *
 * 인증만으로 홈을 보여주면, 초대코드만 만든 "파트너 대기"(isComplete=false) 또는
 * 커플이 아예 없는(조회 404) 사용자도 "연결됨" 화면을 보게 된다.
 * 커플이 실제로 완성된 경우에만 홈을 유지한다. 그 외에는 상태에 맞는 온보딩 단계로 보낸다:
 *   - 커플 있고 미완성(내가 초대 생성, 파트너 대기) → 코드 화면(기존 코드 표시)
 *   - 커플 없음(조회 실패) → 온보딩 처음(프로필/연결)
 *
 * DdayCard와 동일한 ["coupleProfile"] 쿼리를 재사용하므로 추가 네트워크 호출은 없다.
 */
const useRequireCoupleConnected = (): { ready: boolean } => {
	const router = useRouter();
	const { data, isError, isLoading, error } = useCoupleProfile();
	const connected = data?.couple.isComplete === true;

	useEffect(() => {
		if (isLoading) return;
		if (connected) return;
		if (isError) {
			// 401 = 세션 안의 accessToken 만료/무효 → 깨끗이 재로그인.
			// BFF가 죽은 세션 쿠키를 이미 비웠으므로 /login 으로 하드 내비게이션해도
			// proxy.ts가 /home 으로 되튕기지 않는다(루프 없음). 그 외 에러(예: 커플 없음
			// 404)는 온보딩으로 보낸다.
			const message = error instanceof Error ? error.message : "";
			if (/\b401\b/.test(message)) {
				window.location.replace(ROUTES.LOGIN);
				return;
			}
			router.replace(ROUTES.ONBOARDING);
			return;
		}
		// 커플은 있으나 미완성 → 내가 만든 초대 코드를 다시 보여준다.
		if (data?.couple && !data.couple.isComplete) {
			router.replace(ROUTES.ONBOARDING_CONNECT_CODE_GEN);
			return;
		}
		// 커플 없음 → 온보딩 처음.
		router.replace(ROUTES.ONBOARDING);
	}, [isLoading, isError, error, connected, data, router]);

	return { ready: connected };
};

export default useRequireCoupleConnected;
