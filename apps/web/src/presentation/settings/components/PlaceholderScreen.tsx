"use client";

import { useRouter } from "next/navigation";
import { Text } from "woosign-system";

interface Props {
	title: string;
	description?: string;
}

/**
 * 아직 구현되지 않은 설정 하위 화면용 자리표시 스크린.
 * 헤더(뒤로가기 + 제목)와 안내 문구만 제공한다.
 */
export const PlaceholderScreen = ({ title, description = "곧 추가될 화면이에요." }: Props) => {
	const router = useRouter();

	return (
		<div className="flex flex-col min-h-[100dvh] bg-white">
			<header className="flex items-center gap-2 px-3 pt-4 pb-3">
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
				<Text as="h1" variant="p" weight="semibold" style={{ lineHeight: "24px", fontSize: 18 }}>
					{title}
				</Text>
			</header>

			<div className="flex flex-1 items-center justify-center px-6">
				<Text as="p" variant="small" style={{ lineHeight: "20px", color: "#9ca3af" }}>
					{description}
				</Text>
			</div>
		</div>
	);
};
