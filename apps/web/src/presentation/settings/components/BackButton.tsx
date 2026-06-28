"use client";

import { useRouter } from "next/navigation";
import { ChevronIcon } from "@/presentation/components/icons";

/**
 * 설정 화면 공통 뒤로가기 버튼(좌상단 chevron).
 */
export const BackButton = () => {
	const router = useRouter();

	return (
		<button
			type="button"
			aria-label="뒤로가기"
			onClick={() => router.back()}
			className="flex h-11 w-11 items-center justify-center rounded-full"
			style={{ color: "var(--text-primary)" }}
		>
			<ChevronIcon s={20} dir="left" />
		</button>
	);
};
