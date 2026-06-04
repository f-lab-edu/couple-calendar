"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, Text } from "woosign-system";
import useMonthlyEvents from "@/presentation/home/hooks/useMonthlyEvents";
import { InfoRow } from "@/presentation/settings/components/InfoRow";
import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import useAnniversaries from "@/presentation/settings/hooks/useAnniversaries";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useUpdateMyProfile from "@/presentation/settings/hooks/useUpdateMyProfile";
import { formatKoreanDate } from "@/shared/lib/date";
import { zodiacSign } from "@/shared/lib/zodiac";

const PartnerProfilePage = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const update = useUpdateMyProfile();

	const now = new Date();
	const { data: events } = useMonthlyEvents(now.getFullYear(), now.getMonth() + 1);
	const { data: anniversaries } = useAnniversaries();

	const me = data?.me;
	const partner = data?.partner ?? null;

	const [petName, setPetName] = useState("");
	useEffect(() => {
		if (me) setPetName(me.partnerNickname ?? "");
	}, [me]);

	const changed = me ? petName !== (me.partnerNickname ?? "") : false;

	const handleSave = () => {
		update.mutate({ partnerNickname: petName.trim() || null }, { onSuccess: () => router.back() });
	};

	return (
		<div className="flex flex-col min-h-[100dvh] bg-[#f7f4ef]">
			<SettingsEditHeader
				title="상대방 프로필"
				onSave={handleSave}
				saveDisabled={!changed || update.isPending}
				saving={update.isPending}
			/>

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="프로필을 불러오지 못했어요." />
			{data && !partner && (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
						아직 연결된 상대방이 없어요.
					</Text>
				</div>
			)}

			{partner && (
				<>
					<div className="flex flex-col items-center gap-1 bg-white pb-7 pt-2">
						<span
							className="flex h-24 w-24 items-center justify-center rounded-full text-4xl"
							style={{ backgroundColor: "#cfe3c7" }}
							aria-hidden
						>
							🌿
						</span>
						<Text as="p" variant="p" weight="bold" style={{ marginTop: 8, fontSize: 20, color: "#111827" }}>
							{partner.name}
						</Text>
						{partner.birthday && (
							<Text as="p" variant="small" style={{ color: "#6b7280" }}>
								{formatKoreanDate(partner.birthday)}생 · {zodiacSign(partner.birthday)}
							</Text>
						)}
					</div>

					<SectionLabel>내가 부르는 이름</SectionLabel>
					<div className="bg-white">
						<div className="flex items-start justify-between px-5 py-4">
							<Text as="span" variant="p" style={{ color: "#374151" }}>
								별명
							</Text>
							<div className="flex w-1/2 flex-col items-end">
								<input
									type="text"
									value={petName}
									placeholder="별명을 지어주세요"
									onChange={(e) => setPetName(e.target.value)}
									className="w-full bg-transparent text-right text-base font-semibold text-gray-900 outline-none placeholder:text-gray-300"
								/>
								<Text as="span" variant="small" style={{ marginTop: 2, color: "#9ca3af", fontSize: 12 }}>
									나에게만 보입니다
								</Text>
							</div>
						</div>
					</div>

					<SectionLabel>{`${partner.name}에 대해`}</SectionLabel>
					<div className="flex flex-col gap-px bg-white">
						<InfoRow label={`${partner.name}이 등록한 메모`} value={partner.bio ?? "없음"} valueMuted={!partner.bio} />
						<InfoRow label="기념일 보기" value={`${anniversaries?.length ?? 0}개`} chevron />
						<InfoRow label="공유한 사진" value="42장" chevron />
					</div>

					<SectionLabel>활동</SectionLabel>
					<div className="flex flex-col gap-px bg-white">
						<InfoRow label="마지막 활동" value="방금 전" valueMuted />
						<InfoRow label="등록한 일정" value={`이번 달 ${events?.length ?? 0}개`} valueMuted />
					</div>

					<div className="mt-auto px-5 py-6">
						<Card variant="warm" fullWidth style={{ borderRadius: 12, padding: "14px 16px" }}>
							<div className="flex gap-3">
								<span aria-hidden style={{ fontSize: 18 }}>
									❤️
								</span>
								<div className="flex flex-col gap-1">
									<Text as="p" variant="small" weight="semibold" style={{ color: "#be123c", lineHeight: "20px" }}>
										{partner.name}의 본인 정보는 본인만 수정 가능
									</Text>
									<Text as="p" variant="small" style={{ color: "#9f6b73", lineHeight: "18px", fontSize: 12 }}>
										이름, 생일 같은 본인 정보는 {partner.name}이 직접 수정해야 해요. 별명은 나에게만 보여요.
									</Text>
								</div>
							</div>
						</Card>
					</div>
				</>
			)}
		</div>
	);
};

export default PartnerProfilePage;
