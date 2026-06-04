"use client";

import { Button, Text } from "woosign-system";
import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useProfileEditForm from "@/presentation/settings/hooks/useProfileEditForm";

const ProfileEditPage = () => {
	const { data, isLoading, isError } = useCoupleProfile();
	const me = data?.me;
	const { register, submit, today, saving, saveDisabled, saveError, cancel } = useProfileEditForm(me);

	return (
		<div className="flex flex-col min-h-[100dvh] bg-[#f7f4ef]">
			<SettingsEditHeader title="내 프로필 수정" onSave={submit} saveDisabled={saveDisabled} saving={saving} />

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="프로필을 불러오지 못했어요." />

			{me && (
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
								{...register("name")}
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
									{...register("nickname")}
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
								max={today}
								{...register("birthday")}
								className="bg-transparent text-right text-base font-semibold text-gray-900 outline-none"
							/>
						</div>
					</div>

					<SectionLabel>소개</SectionLabel>
					<div className="bg-white px-5 py-4">
						<textarea
							{...register("bio")}
							rows={3}
							placeholder="자기소개를 입력해 주세요."
							className="w-full resize-none bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-300"
						/>
					</div>

					{saveError && (
						<Text as="p" variant="small" style={{ padding: "12px 20px 0", color: "#dc2626" }}>
							{saveError}
						</Text>
					)}

					<div className="mt-auto px-5 py-6">
						<Button variant="secondary" size="lg" fullWidth onPress={cancel}>
							취소
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default ProfileEditPage;
