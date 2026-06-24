"use client";

import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { FieldRow } from "@/presentation/settings/components/SettingsRows";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useProfileEditForm from "@/presentation/settings/hooks/useProfileEditForm";

const rightInputStyle = {
	background: "transparent",
	textAlign: "right" as const,
	fontSize: 16,
	fontWeight: 600,
	color: "var(--text-brand)",
	outline: "none",
	border: "none",
	width: "100%",
};

const ProfileEditPage = () => {
	const { data, isLoading, isError } = useCoupleProfile();
	const me = data?.me;
	const { register, submit, today, saving, saveDisabled, saveError, cancel } = useProfileEditForm(me);

	return (
		<div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--bg-section)" }}>
			<SettingsEditHeader title="내 프로필 수정" onSave={submit} saveDisabled={saveDisabled} saving={saving} />

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="프로필을 불러오지 못했어요." />

			{me && (
				<>
					<div className="flex flex-col items-center gap-2 pb-7 pt-4" style={{ background: "var(--cream-200)" }}>
						<button
							type="button"
							onClick={() => window.alert("프로필 사진 변경은 준비 중이에요.")}
							className="relative flex h-24 w-24 items-center justify-center rounded-full text-4xl"
							style={{ background: "#3a2e33" }}
						>
							<span aria-hidden>🌷</span>
							<span
								className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full"
								style={{ background: "var(--text-brand)", color: "var(--cream-100)", fontSize: 13 }}
								aria-hidden
							>
								📷
							</span>
						</button>
						<span className="wb-caption">탭하여 사진 변경</span>
					</div>

					<SectionLabel>기본 정보</SectionLabel>
					<div>
						<FieldRow label="이름">
							<input type="text" {...register("name")} style={rightInputStyle} />
						</FieldRow>
						<FieldRow label="닉네임" align="start">
							<input type="text" {...register("nickname")} style={rightInputStyle} />
							<span className="wb-caption" style={{ marginTop: 2, fontSize: 12 }}>
								상대방에게 보이는 이름
							</span>
						</FieldRow>
						<FieldRow label="생일">
							<input type="date" max={today} {...register("birthday")} style={{ ...rightInputStyle, width: "auto" }} />
						</FieldRow>
					</div>

					<SectionLabel>소개</SectionLabel>
					<div style={{ background: "#1a1a1c", padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
						<textarea
							{...register("bio")}
							rows={3}
							placeholder="자기소개를 입력해 주세요."
							className="w-full resize-none"
							style={{ background: "transparent", fontSize: 16, color: "var(--text-brand)", outline: "none", border: "none" }}
						/>
					</div>

					{saveError && (
						<p className="wb-body-sm" style={{ padding: "12px 20px 0", color: "var(--error-red)" }}>
							{saveError}
						</p>
					)}

					<div className="mt-auto px-5 pt-6 pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)]">
						<button type="button" onClick={cancel} className="wb-btn wb-btn--secondary wb-btn--lg" style={{ width: "100%" }}>
							취소
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default ProfileEditPage;
