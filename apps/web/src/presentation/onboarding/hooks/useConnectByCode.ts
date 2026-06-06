"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useConnectCouple from "@/presentation/onboarding/hooks/useConnectCouple";

const CODE_LENGTH = 6;

/**
 * 초대 코드 입력 화면(온보딩)의 뷰모델.
 * 6자리 코드 입력 → 완성 여부 판단 → 연결(성공 시 홈으로 교체 이동)을 담당한다.
 */
const useConnectByCode = () => {
	const router = useRouter();
	const [code, setCode] = useState("");
	const { mutate: connectCouple, isPending, error } = useConnectCouple();

	const isComplete = code.length === CODE_LENGTH;

	const connect = () => {
		if (!isComplete || isPending) return;
		connectCouple(code, { onSuccess: () => router.replace("/home") });
	};

	return {
		code,
		setCode,
		codeLength: CODE_LENGTH,
		isComplete,
		connect,
		goBack: () => router.back(),
		isPending,
		error,
	};
};

export default useConnectByCode;
