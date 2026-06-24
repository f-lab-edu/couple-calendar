"use client";

import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { ToggleRow } from "@/presentation/settings/components/SettingsRows";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import useNotificationForm from "@/presentation/settings/hooks/useNotificationForm";
import { ANNIVERSARY_REMINDERS, EVENT_REMINDERS } from "@/shared/constants/notifications";

const ReminderPicker = ({
	options,
	value,
	onSelect,
}: {
	options: readonly string[];
	value: string;
	onSelect: (next: string) => void;
}) => (
	<div
		className="flex flex-wrap gap-2"
		style={{ background: "#1a1a1c", padding: "12px 16px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
	>
		{options.map((option) => (
			<button
				key={option}
				type="button"
				onClick={() => onSelect(option)}
				className={value === option ? "wb-pill wb-pill--active" : "wb-pill"}
			>
				{option}
			</button>
		))}
	</div>
);

const NotificationsPage = () => {
	const { isLoading, isError, form, updateField, save, saving, saveDisabled, saveError } = useNotificationForm();

	return (
		<div className="flex min-h-[100dvh] flex-col" style={{ background: "var(--bg-section)" }}>
			<SettingsEditHeader title="알림 설정" onSave={save} saveDisabled={saveDisabled} saving={saving} />

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="알림 설정을 불러오지 못했어요." />

			{form && (
				<>
					<SectionLabel>일정 알림</SectionLabel>
					<div>
						<ToggleRow
							label="일정 알림 받기"
							on={form.eventEnabled}
							onChange={(next) => updateField("eventEnabled", next)}
						/>
						{form.eventEnabled && (
							<ReminderPicker
								options={EVENT_REMINDERS}
								value={form.eventReminder}
								onSelect={(next) => updateField("eventReminder", next)}
							/>
						)}
					</div>

					<SectionLabel>기념일 알림</SectionLabel>
					<div>
						<ToggleRow
							label="기념일 알림 받기"
							on={form.anniversaryEnabled}
							onChange={(next) => updateField("anniversaryEnabled", next)}
						/>
						{form.anniversaryEnabled && (
							<ReminderPicker
								options={ANNIVERSARY_REMINDERS}
								value={form.anniversaryReminder}
								onSelect={(next) => updateField("anniversaryReminder", next)}
							/>
						)}
					</div>

					<SectionLabel>상대방 활동</SectionLabel>
					<div>
						<ToggleRow
							label="상대방 활동 알림"
							on={form.partnerActivityEnabled}
							onChange={(next) => updateField("partnerActivityEnabled", next)}
						/>
					</div>

					{saveError && (
						<p className="wb-body-sm" style={{ padding: "12px 20px 0", color: "var(--error-red)" }}>
							{saveError}
						</p>
					)}

					<p
						className="wb-caption"
						style={{
							padding: "16px 20px",
							paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
							fontSize: 12,
						}}
					>
						알림은 두 사람 각자의 기기 설정을 따릅니다.
					</p>
				</>
			)}
		</div>
	);
};

export default NotificationsPage;
