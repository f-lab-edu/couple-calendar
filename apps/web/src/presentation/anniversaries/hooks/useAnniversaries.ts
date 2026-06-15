"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnniversariesUseCase } from "@/composition/anniversary";
import type Anniversary from "@/domain/entities/Anniversary";

/**
 * 커플 기념일 목록(AUTO 마일스톤 + CUSTOM 기념일).
 */
const useAnniversaries = () =>
	useQuery<Anniversary[]>({
		queryKey: ["anniversaries"],
		queryFn: () => getAnniversariesUseCase.execute(),
	});

export default useAnniversaries;
