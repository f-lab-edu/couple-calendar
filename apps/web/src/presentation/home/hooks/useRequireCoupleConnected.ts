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
	const { data, isError, isLoading } = useCoupleProfile();
	const connected = data?.couple.isComplete === true;

	useEffect(() => {
		if (isLoading) return;
		if (connected) return;
		// 커플은 있으나 미완성 → 내가 만든 초대 코드를 다시 보여준다.
		if (!isError && data?.couple && !data.couple.isComplete) {
			router.replace(ROUTES.ONBOARDING_CONNECT_CODE_GEN);
			return;
		}
		// 커플 없음(조회 실패 등) → 온보딩 처음.
		router.replace(ROUTES.ONBOARDING);
	}, [isLoading, isError, connected, data, router]);

	return { ready: connected };
};

export default useRequireCoupleConnected;
