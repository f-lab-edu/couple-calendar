"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/settings/actions";
import { CoupleHero } from "@/presentation/settings/components/CoupleHero";
import { DisconnectDialog } from "@/presentation/settings/components/DisconnectDialog";
import { SettingRow } from "@/presentation/settings/components/SettingRow";
import { SettingsHeader } from "@/presentation/settings/components/SettingsHeader";
import { StartDateDialog } from "@/presentation/settings/components/StartDateDialog";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";
import useDisconnectDialog from "@/presentation/settings/hooks/useDisconnectDialog";
import useStartDateDialog from "@/presentation/settings/hooks/useStartDateDialog";
import { LEGAL_LINKS, ROUTES } from "@/shared/constants/routes";
import { formatBirthday, formatKoreanDate } from "@/shared/lib/date";

const describeProfile = (nickname: string, birthday: string | null): string =>
	birthday ? `${nickname}, ${formatBirthday(birthday)}` : nickname;

const openExternal = (url: string): void => {
	window.open(url, "_blank", "noopener,noreferrer");
};

const SettingsPage = () => {
	const router = useRouter();
	const { data, isLoading, isError } = useCoupleProfile();
	const startDate = useStartDateDialog();
	const disconnect = useDisconnectDialog();

	return (
		<div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--bg-section)" }}>
			<SettingsHeader title="설정" />

			{isLoading && (
				<div className="flex flex-1 items-center justify-center px-6">
					<p className="wb-body-sm" style={{ color: "var(--text-secondary)" }}>
						불러오는 중…
					</p>
				</div>
			)}

			{isError && (
				<div className="flex flex-1 items-center justify-center px-6">
					<p className="wb-body-sm" style={{ color: "var(--error-red)" }}>
						정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
					</p>
				</div>
			)}

			{data && (
				<>
					<CoupleHero
						myName={data.me.name}
						partnerName={data.partner?.name ?? "상대방"}
						startedAt={formatKoreanDate(data.couple.startDate)}
						dPlus={data.couple.daysFromStart}
					/>

					<div className="mt-2 flex flex-col gap-1.5 px-5 pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)]">
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
							title="기념일 관리"
							description="우리만의 기념일 추가·수정"
							onClick={() => router.push(ROUTES.SETTINGS_ANNIVERSARIES)}
						/>
						<SettingRow
							title="알림 설정"
							description="일정 1일 전 / 기념일 당일"
							onClick={() => router.push(ROUTES.SETTINGS_NOTIFICATIONS)}
						/>
						<SettingRow title="개인정보 처리방침" onClick={() => openExternal(LEGAL_LINKS.PRIVACY)} />
						<SettingRow title="이용약관" onClick={() => openExternal(LEGAL_LINKS.TERMS)} />
						<SettingRow title="로그아웃" onClick={() => logoutAction()} />
						<SettingRow title="연결 끊기" destructive onClick={disconnect.show} />
					</div>
				</>
			)}

			<DisconnectDialog
				open={disconnect.open}
				loading={disconnect.loading}
				partnerName={data?.partner?.name}
				onCancel={disconnect.hide}
				onConfirm={disconnect.confirm}
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
