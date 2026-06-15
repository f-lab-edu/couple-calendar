"use client";

import { Pill, Switch, Text } from "woosign-system";
import { SectionLabel } from "@/presentation/settings/components/SectionLabel";
import { SettingsEditHeader } from "@/presentation/settings/components/SettingsEditHeader";
import { SettingsLoadState } from "@/presentation/settings/components/SettingsLoadState";
import useNotificationForm from "@/presentation/settings/hooks/useNotificationForm";
import { ANNIVERSARY_REMINDERS, EVENT_REMINDERS } from "@/shared/constants/notifications";

const ToggleRow = ({
	title,
	checked,
	onChange,
}: {
	title: string;
	checked: boolean;
	onChange: (next: boolean) => void;
}) => (
	<div className="flex items-center justify-between px-5 py-4">
		<Text as="span" variant="p" weight="semibold" style={{ color: "#111827" }}>
			{title}
		</Text>
		<Switch checked={checked} onCheckedChange={onChange} size="sm" />
	</div>
);

const ReminderPicker = ({
	options,
	value,
	onSelect,
}: {
	options: readonly string[];
	value: string;
	onSelect: (next: string) => void;
}) => (
	<div className="flex flex-wrap gap-2 border-t border-gray-100 px-5 py-4">
		{options.map((option) => (
			<Pill key={option} active={value === option} onPress={() => onSelect(option)}>
				{option}
			</Pill>
		))}
	</div>
);

const NotificationsPage = () => {
	const { isLoading, isError, form, updateField, save, saving, saveDisabled, saveError } = useNotificationForm();

	return (
		<div className="flex flex-col min-h-[100dvh] bg-[#f7f4ef]">
			<SettingsEditHeader title="알림 설정" onSave={save} saveDisabled={saveDisabled} saving={saving} />

			<SettingsLoadState isLoading={isLoading} isError={isError} errorText="알림 설정을 불러오지 못했어요." />

			{form && (
				<>
					<SectionLabel>일정 알림</SectionLabel>
					<div className="bg-white">
						<ToggleRow
							title="일정 알림 받기"
							checked={form.eventEnabled}
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
					<div className="bg-white">
						<ToggleRow
							title="기념일 알림 받기"
							checked={form.anniversaryEnabled}
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

					<SectionLabel>기타</SectionLabel>
					<div className="bg-white">
						<ToggleRow
							title="상대방 활동 알림"
							checked={form.partnerActivityEnabled}
							onChange={(next) => updateField("partnerActivityEnabled", next)}
						/>
					</div>

					{saveError && (
						<Text as="p" variant="small" style={{ padding: "12px 20px 0", color: "#dc2626" }}>
							{saveError}
						</Text>
					)}

					<Text
						as="p"
						variant="small"
						style={{
							padding: "16px 20px",
							paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)",
							color: "#9ca3af",
							fontSize: 12,
						}}
					>
						알림은 두 사람 각자의 기기 설정을 따릅니다.
					</Text>
				</>
			)}
		</div>
	);
};

export default NotificationsPage;
