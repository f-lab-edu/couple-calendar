"use client";

import { useRouter } from "next/navigation";

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
			className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700"
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<path
					d="M12.5 4.5L7 10L12.5 15.5"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</button>
	);
};
