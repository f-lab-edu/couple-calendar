"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Pill, Switch, Text } from "woosign-system";
import useNotificationSettings from "@/presentation/settings/hooks/useNotificationSettings";
import useUpdateNotificationSettings from "@/presentation/settings/hooks/useUpdateNotificationSettings";
import { ANNIVERSARY_REMINDERS, EVENT_REMINDERS } from "@/shared/constants/notifications";

interface Form {
	eventEnabled: boolean;
	eventReminder: string;
	anniversaryEnabled: boolean;
	anniversaryReminder: string;
	partnerActivityEnabled: boolean;
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
	const router = useRouter();
	const { data, isLoading, isError } = useNotificationSettings();
	const update = useUpdateNotificationSettings();

	const [form, setForm] = useState<Form | null>(null);

	useEffect(() => {
		if (!data) return;
		setForm({
			eventEnabled: data.eventEnabled,
			eventReminder: data.eventReminder,
			anniversaryEnabled: data.anniversaryEnabled,
			anniversaryReminder: data.anniversaryReminder,
			partnerActivityEnabled: data.partnerActivityEnabled,
		});
	}, [data]);

	const changed =
		data && form
			? form.eventEnabled !== data.eventEnabled ||
				form.eventReminder !== data.eventReminder ||
				form.anniversaryEnabled !== data.anniversaryEnabled ||
				form.anniversaryReminder !== data.anniversaryReminder ||
				form.partnerActivityEnabled !== data.partnerActivityEnabled
			: false;

	const handleSave = () => {
		if (!form) return;
		update.mutate(form, { onSuccess: () => router.back() });
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
						알림 설정
					</Text>
				</div>
				<Button
					variant="default"
					size="sm"
					disabled={!changed || update.isPending}
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
						알림 설정을 불러오지 못했어요.
					</Text>
				</div>
			)}

			{form && (
				<>
					<SectionLabel>일정 알림</SectionLabel>
					<div className="bg-white">
						<ToggleRow
							title="일정 알림 받기"
							checked={form.eventEnabled}
							onChange={(next) => setForm({ ...form, eventEnabled: next })}
						/>
						{form.eventEnabled && (
							<ReminderPicker
								options={EVENT_REMINDERS}
								value={form.eventReminder}
								onSelect={(next) => setForm({ ...form, eventReminder: next })}
							/>
						)}
					</div>

					<SectionLabel>기념일 알림</SectionLabel>
					<div className="bg-white">
						<ToggleRow
							title="기념일 알림 받기"
							checked={form.anniversaryEnabled}
							onChange={(next) => setForm({ ...form, anniversaryEnabled: next })}
						/>
						{form.anniversaryEnabled && (
							<ReminderPicker
								options={ANNIVERSARY_REMINDERS}
								value={form.anniversaryReminder}
								onSelect={(next) => setForm({ ...form, anniversaryReminder: next })}
							/>
						)}
					</div>

					<SectionLabel>기타</SectionLabel>
					<div className="bg-white">
						<ToggleRow
							title="상대방 활동 알림"
							checked={form.partnerActivityEnabled}
							onChange={(next) => setForm({ ...form, partnerActivityEnabled: next })}
						/>
					</div>

					{update.isError && (
						<Text as="p" variant="small" style={{ padding: "12px 20px 0", color: "#dc2626" }}>
							{update.error?.message ?? "저장에 실패했어요. 다시 시도해 주세요."}
						</Text>
					)}

					<Text as="p" variant="small" style={{ padding: "16px 20px", color: "#9ca3af", fontSize: 12 }}>
						알림은 두 사람 각자의 기기 설정을 따릅니다.
					</Text>
				</>
			)}
		</div>
	);
};

export default NotificationsPage;
