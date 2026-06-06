"use client";

import { useMutation } from "@tanstack/react-query";
import { generateInviteCodeUseCase } from "@/composition/couple";
import type InviteCode from "@/domain/entities/InviteCode";

/**
 * 시작일을 받아 초대 코드를 발급하는 mutation hook.
 */
const useGenerateInviteCode = () =>
	useMutation<InviteCode, Error, string>({
		mutationFn: (startDate: string) => generateInviteCodeUseCase.execute(startDate),
	});

export default useGenerateInviteCode;
