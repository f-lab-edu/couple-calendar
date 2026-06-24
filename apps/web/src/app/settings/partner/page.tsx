"use client";

import { HeartIcon } from "@/presentation/components/icons";
import { InfoRow } from "@/presentation/settings/components/InfoRow";
import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { FieldRow } from "@/presentation/settings/components/SettingsRows";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import usePartnerProfileForm from "@/presentation/settings/hooks/usePartnerProfileForm";
import { formatKoreanDate } from "@/shared/lib/date";
import { zodiacSign } from "@/shared/lib/zodiac";

const PartnerProfilePage = () => {
	const {
		isLoading,
		isError,
		hasNoPartner,
		partner,
		petName,
		setPetName,
		changed,
		save,
		saving,
		anniversaryCount,
		monthlyEventCount,
	} = usePartnerProfileForm();

	return (
		<div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--bg-section)" }}>
			<SettingsEditHeader title="상대방 프로필" onSave={save} saveDisabled={!changed || saving} saving={saving} />

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="프로필을 불러오지 못했어요." />
			{hasNoPartner && (
				<div className="flex flex-1 items-center justify-center px-6">
					<p className="wb-body-sm" style={{ color: "var(--text-secondary)" }}>
						아직 연결된 상대방이 없어요.
					</p>
				</div>
			)}

			{partner && (
				<>
					<div className="flex flex-col items-center gap-1 pb-7 pt-4" style={{ background: "var(--cream-200)" }}>
						<span
							className="flex h-24 w-24 items-center justify-center rounded-full text-4xl"
							style={{ background: "#2c3a30" }}
							aria-hidden
						>
							🌿
						</span>
						<p style={{ marginTop: 8, fontSize: 20, fontWeight: 700, color: "var(--text-brand)" }}>{partner.name}</p>
						{partner.birthday && (
							<p className="wb-caption">
								{formatKoreanDate(partner.birthday)}생 · {zodiacSign(partner.birthday)}
							</p>
						)}
					</div>

					<SectionLabel>내가 부르는 이름</SectionLabel>
					<div>
						<FieldRow label="별명" align="start">
							<input
								type="text"
								value={petName}
								placeholder="별명을 지어주세요"
								onChange={(e) => setPetName(e.target.value)}
								style={{
									background: "transparent",
									textAlign: "right",
									fontSize: 16,
									fontWeight: 600,
									color: "var(--text-brand)",
									outline: "none",
									border: "none",
									width: "100%",
								}}
							/>
							<span className="wb-caption" style={{ marginTop: 2, fontSize: 12 }}>
								나에게만 보입니다
							</span>
						</FieldRow>
					</div>

					<SectionLabel>{`${partner.name}에 대해`}</SectionLabel>
					<div>
						<InfoRow label={`${partner.name}이 등록한 메모`} value={partner.bio ?? "없음"} valueMuted={!partner.bio} />
						<InfoRow label="기념일" value={`${anniversaryCount}개`} />
						<InfoRow label="이번 달 등록한 일정" value={`${monthlyEventCount}개`} />
					</div>

					<div className="mt-auto px-5 pt-6 pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)]">
						<div
							className="flex gap-3"
							style={{
								background: "rgba(176,40,24,0.08)",
								border: "1px solid rgba(176,40,24,0.24)",
								borderRadius: "var(--radius-md)",
								padding: "14px 16px",
							}}
						>
							<HeartIcon s={18} style={{ color: "var(--error-red)", flexShrink: 0, marginTop: 2 }} />
							<div className="flex flex-col gap-1">
								<p style={{ fontSize: 13, fontWeight: 600, color: "var(--error-red)", lineHeight: "20px" }}>
									{partner.name}의 본인 정보는 본인만 수정 가능
								</p>
								<p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: "18px" }}>
									이름, 생일 같은 본인 정보는 {partner.name}이 직접 수정해야 해요. 별명은 나에게만 보여요.
								</p>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default PartnerProfilePage;
