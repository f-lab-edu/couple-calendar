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
 * 커플이 실제로 완성된 경우에만 홈을 유지하고, 아니면 온보딩으로 돌려보낸다.
 *
 * DdayCard와 동일한 ["coupleProfile"] 쿼리를 재사용하므로 추가 네트워크 호출은 없다.
 */
const useRequireCoupleConnected = (): { ready: boolean } => {
	const router = useRouter();
	const { data, isError, isLoading } = useCoupleProfile();
	const connected = data?.couple.isComplete === true;

	useEffect(() => {
		if (isLoading) return;
		if (isError || !connected) {
			router.replace(ROUTES.ONBOARDING);
		}
	}, [isLoading, isError, connected, router]);

	return { ready: connected };
};

export default useRequireCoupleConnected;
