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
	});

export default useCoupleProfile;
