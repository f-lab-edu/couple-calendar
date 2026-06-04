"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Text } from "woosign-system";
import { CoupleHero } from "@/presentation/settings/components/CoupleHero";
import { DisconnectDialog } from "@/presentation/settings/components/DisconnectDialog";
import { SettingRow } from "@/presentation/settings/components/SettingRow";
import { SettingsHeader } from "@/presentation/settings/components/SettingsHeader";
import { StartDateDialog } from "@/presentation/settings/components/StartDateDialog";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useDisconnectCouple from "@/presentation/settings/hooks/useDisconnectCouple";
import useStartDateDialog from "@/presentation/settings/hooks/useStartDateDialog";
import { ROUTES } from "@/shared/constants/routes";
import { formatBirthday, formatKoreanDate } from "@/shared/lib/date";

const describeProfile = (nickname: string, birthday: string | null): string =>
	birthday ? `${nickname}, ${formatBirthday(birthday)}` : nickname;

const SettingsPage = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const disconnect = useDisconnectCouple();
	const startDate = useStartDateDialog();
	const [dialogOpen, setDialogOpen] = useState(false);

	// 연결 끊기 다이얼로그 동작 (시작일 다이얼로그는 useStartDateDialog가 담당)
	const closeDisconnectDialog = () => setDialogOpen(false);
	const handleDisconnect = () => disconnect.mutate();

	return (
		<div className="flex flex-col min-h-[100dvh] bg-white">
			<SettingsHeader title="설정" />

			{isLoading && (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#9ca3af" }}>
						불러오는 중…
					</Text>
				</div>
			)}

			{isError && (
				<div className="flex flex-1 items-center justify-center px-6">
					<Text as="p" variant="small" style={{ color: "#dc2626" }}>
						정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
					</Text>
				</div>
			)}

			{data && (
				<>
					<div className="px-5 pt-2">
						<CoupleHero
							myName={data.me.name}
							partnerName={data.partner?.name ?? "상대방"}
							startedAt={formatKoreanDate(data.couple.startDate)}
							dPlus={data.couple.daysFromStart}
						/>
					</div>

					<div className="mt-5 flex flex-col gap-3 px-5">
						<SettingRow
							title="우리 시작일"
							description={formatKoreanDate(data.couple.startDate)}
							onClick={startDate.show}
						/>
						<SettingRow
							title="내 프로필 수정"
							description={describeProfile(data.me.name, data.me.birthday)}
							onClick={() => router.push(ROUTES.SETTINGS_PROFILE_EDIT)}
						/>
						<SettingRow
							title="상대방 프로필"
							description={data.partner ? describeProfile(data.partner.name, data.partner.birthday) : "연결 대기 중"}
							onClick={() => router.push(ROUTES.SETTINGS_PARTNER_PROFILE)}
						/>
						<SettingRow
							title="알림 설정"
							description="일정 1일 전 / 기념일 당일"
							onClick={() => router.push(ROUTES.SETTINGS_NOTIFICATIONS)}
						/>
						<SettingRow title="연결 끊기" destructive onClick={() => setDialogOpen(true)} />
					</div>
				</>
			)}

			<DisconnectDialog
				open={dialogOpen}
				loading={disconnect.isPending}
				onCancel={closeDisconnectDialog}
				onConfirm={handleDisconnect}
			/>

			<StartDateDialog
				open={startDate.open}
				initialDate={data?.couple.startDate.slice(0, 10) ?? ""}
				loading={startDate.loading}
				errorMessage={startDate.error}
				onCancel={startDate.hide}
				onConfirm={startDate.confirm}
			/>
		</div>
	);
};

export default SettingsPage;
