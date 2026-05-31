"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Text } from "woosign-system";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useUpdateMyProfile from "@/presentation/settings/hooks/useUpdateMyProfile";

interface ProfileForm {
	name: string;
	nickname: string;
	birthday: string;
	bio: string;
}

const SectionLabel = ({ children }: { children: string }) => (
	<Text
		as="p"
		variant="small"
		weight="semibold"
		style={{ padding: "16px 20px 8px", fontSize: 13, color: "#9ca3af" }}
	>
		{children}
	</Text>
);

const ProfileEditPage = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const update = useUpdateMyProfile();
	const me = data?.me;

	const [form, setForm] = useState<ProfileForm | null>(null);

	useEffect(() => {
		if (!me) return;
		setForm({
			name: me.name,
			nickname: me.nickname,
			birthday: me.birthday ?? "",
			bio: me.bio ?? "",
		});
	}, [me]);

	const today = new Date().toISOString().slice(0, 10);

	const handleSave = () => {
		if (!form) return;
		update.mutate(
			{
				name: form.name,
				nickname: form.nickname,
				birthday: form.birthday || null,
				bio: form.bio || null,
			},
			{ onSuccess: () => router.back() },
		);
	};

	return (
		<div className="flex flex-col min-h-[100dvh] bg-[#f7f4ef]">
			<header className="flex items-center justify-between px-3 pt-4 pb-3 bg-white">
				<div className="flex items-center gap-2">
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
						내 프로필 수정
					</Text>
				</div>
				<Button
					variant="default"
					size="sm"
					disabled={!form || update.isPending}
					loading={update.isPending}
					onPress={handleSave}
					style={{ borderRadius: 999 }}
				>
					저장
				</Button>
			</header>

			{isLoading && (
				<div className="flex flex-1 items-center justify-center">
					<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
						불러오는 중…
					</Text>
				</div>
			)}
			{isError && (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#dc2626" }}>
						프로필을 불러오지 못했어요.
					</Text>
				</div>
			)}

			{form && (
				<>
					<div className="flex flex-col items-center gap-2 bg-white pb-7 pt-2">
						<button
							type="button"
							onClick={() => window.alert("프로필 사진 변경은 준비 중이에요.")}
							className="relative flex h-24 w-24 items-center justify-center rounded-full text-4xl"
							style={{ backgroundColor: "#fbd5dc" }}
						>
							<span aria-hidden>🌷</span>
							<span
								className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full text-white"
								style={{ backgroundColor: "#0f3a2d", fontSize: 14 }}
								aria-hidden
							>
								📷
							</span>
						</button>
						<Text as="span" variant="small" style={{ color: "#6b7280" }}>
							탭하여 사진 변경
						</Text>
					</div>

					<SectionLabel>기본 정보</SectionLabel>
					<div className="bg-white">
						<div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
							<Text as="span" variant="p" style={{ color: "#374151" }}>
								이름
							</Text>
							<input
								type="text"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
								className="w-1/2 bg-transparent text-right text-base font-semibold text-gray-900 outline-none"
							/>
						</div>
						<div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
							<Text as="span" variant="p" style={{ color: "#374151" }}>
								닉네임
							</Text>
							<div className="flex w-1/2 flex-col items-end">
								<input
									type="text"
									value={form.nickname}
									onChange={(e) => setForm({ ...form, nickname: e.target.value })}
									className="w-full bg-transparent text-right text-base font-semibold text-gray-900 outline-none"
								/>
								<Text as="span" variant="small" style={{ marginTop: 2, color: "#9ca3af", fontSize: 12 }}>
									상대방에게 보이는 이름
								</Text>
							</div>
						</div>
						<div className="flex items-center justify-between px-5 py-4">
							<Text as="span" variant="p" style={{ color: "#374151" }}>
								생일
							</Text>
							<input
								type="date"
								value={form.birthday}
								max={today}
								onChange={(e) => setForm({ ...form, birthday: e.target.value })}
								className="bg-transparent text-right text-base font-semibold text-gray-900 outline-none"
							/>
						</div>
					</div>

					<SectionLabel>소개</SectionLabel>
					<div className="bg-white px-5 py-4">
						<textarea
							value={form.bio}
							onChange={(e) => setForm({ ...form, bio: e.target.value })}
							rows={3}
							placeholder="자기소개를 입력해 주세요."
							className="w-full resize-none bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-300"
						/>
					</div>

					{update.isError && (
						<Text as="p" variant="small" style={{ padding: "12px 20px 0", color: "#dc2626" }}>
							{update.error?.message ?? "저장에 실패했어요. 다시 시도해 주세요."}
						</Text>
					)}

					<div className="mt-auto px-5 py-6">
						<Button variant="secondary" size="lg" fullWidth onPress={() => router.back()}>
							취소
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default ProfileEditPage;
