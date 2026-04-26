"use client";

import { useRouter } from "next/navigation";
import { Text } from "woosign-system";
import { CoupleHero } from "./_components/CoupleHero";
import { SettingRow } from "./_components/SettingRow";

const SettingsPage = () => {
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
					설정
				</Text>
			</header>

			<div className="px-5 pt-2">
				<CoupleHero myName="지수" partnerName="민준" startedAt="2025년 3월 9일" dPlus={412} />
			</div>

			<div className="mt-5 flex flex-col gap-3 px-5">
				<SettingRow title="내 프로필 수정" description="지수, 1996.08.14" onClick={() => {}} />
				<SettingRow title="상대방 프로필" description="민준, 1995.11.02" onClick={() => {}} />
				<SettingRow title="알림 설정" description="일정 1일 전 / 기념일 당일" onClick={() => {}} />
				<SettingRow title="연결 끊기" destructive onClick={() => {}} />
			</div>
		</div>
	);
};

export default SettingsPage;
