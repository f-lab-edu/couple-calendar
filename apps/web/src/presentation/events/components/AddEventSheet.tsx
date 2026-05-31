"use client";

import { useState } from "react";
import { Button, Input, Pill, Switch, Text } from "woosign-system";
import useCreateEvent from "@/presentation/events/hooks/useCreateEvent";
import {
	allDayEndIso,
	allDayStartIso,
	CATEGORY_TO_DTO,
	type CategoryId,
	toKstIso,
	todayString,
} from "@/presentation/events/lib/eventForm";
import CATEGORIES from "@/shared/constants/events/categories";
import REMINDERS from "@/shared/constants/events/reminders";

interface Props {
	open: boolean;
	onClose: () => void;
}

const AddEventSheet = ({ open, onClose }: Props) => {
	const { mutate: createEvent, isPending, error } = useCreateEvent();

	const [title, setTitle] = useState("");
	const [category, setCategory] = useState<CategoryId>("date");
	const [date, setDate] = useState(todayString);
	const [startTime, setStartTime] = useState("19:00");
	const [endTime, setEndTime] = useState("21:00");
	const [allDay, setAllDay] = useState(false);
	const [reminder, setReminder] = useState<(typeof REMINDERS)[number]>("1시간 전");
	const [location, setLocation] = useState("");
	const [memo, setMemo] = useState("");

	const isSavable = title.trim().length > 0 && date.length > 0 && !isPending;

	const handleSave = () => {
		if (!isSavable) return;
		createEvent(
			{
				title: title.trim(),
				startTime: allDay ? allDayStartIso(date) : toKstIso(date, startTime),
				endTime: allDay ? allDayEndIso(date) : toKstIso(date, endTime),
				category: CATEGORY_TO_DTO[category],
				description: memo.trim() || null,
				location: location.trim() || null,
			},
			{ onSuccess: () => onClose() },
		);
	};

	return (
		<>
			<button
				type="button"
				aria-label="배경"
				tabIndex={-1}
				onClick={onClose}
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
					open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
				}`}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-hidden={!open}
				className={`fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[95dvh] w-full max-w-[420px] flex-col rounded-t-2xl bg-white shadow-2xl transition-transform duration-300 ease-out ${
					open ? "translate-y-0" : "pointer-events-none translate-y-full"
				}`}
			>
				<header className="flex shrink-0 items-center justify-end px-5 pt-4 pb-3">
					<button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="grid size-8 place-items-center text-2xl text-neutral-800"
					>
						×
					</button>
				</header>

				<div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-5 pt-2 pb-4">
					<section>
						<div style={{ borderBottom: "1px solid #e5e7eb" }}>
							<Input
								value={title}
								onChangeText={setTitle}
								placeholder="일정 제목"
								fullWidth
								style={{
									borderWidth: 0,
									borderRadius: 0,
									padding: "0 0 12px",
									fontSize: 24,
									fontWeight: 600,
									color: "#111827",
									backgroundColor: "transparent",
								}}
							/>
						</div>
					</section>

					<section className="flex flex-col gap-2.5">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							카테고리
						</Text>
						<div className="flex flex-wrap gap-2">
							{CATEGORIES.map((c) => (
								<Pill key={c.id} active={category === c.id} onPress={() => setCategory(c.id)}>
									<span className="inline-flex items-center gap-1.5">
										<span className="inline-block size-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
										{c.label}
									</span>
								</Pill>
							))}
						</div>
					</section>

					<section className="flex flex-col gap-2.5">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							날짜
						</Text>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
						/>
					</section>

					<section className="flex flex-col gap-2.5">
						<div className="flex items-center justify-between">
							<Text as="p" variant="muted" style={{ fontSize: 12 }}>
								시간
							</Text>
							<Switch checked={allDay} onCheckedChange={setAllDay} label="종일" size="sm" />
						</div>

						<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
							<input
								type="time"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								disabled={allDay}
								className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400 disabled:opacity-40"
							/>
							<span className="text-neutral-400">—</span>
							<input
								type="time"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								disabled={allDay}
								className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400 disabled:opacity-40"
							/>
						</div>
					</section>

					<section className="flex flex-col gap-2.5">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							장소
						</Text>
						<Input
							value={location}
							onChangeText={setLocation}
							placeholder="예: 성수동 어니언"
							fullWidth
							leftIcon={
								<span aria-hidden className="text-neutral-400">
									⌖
								</span>
							}
						/>
					</section>

					<section className="flex flex-col gap-2.5">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							알림
						</Text>
						<div className="flex flex-wrap gap-2">
							{REMINDERS.map((r) => (
								<Pill key={r} active={reminder === r} onPress={() => setReminder(r)}>
									{r}
								</Pill>
							))}
						</div>
					</section>

					<section className="flex flex-col gap-2.5">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							메모
						</Text>
						<Input
							value={memo}
							onChangeText={setMemo}
							placeholder="기억하고 싶은 것을 적어두세요"
							multiline
							numberOfLines={3}
							fullWidth
							style={{ height: "auto", alignItems: "flex-start", paddingTop: 12, paddingBottom: 12 }}
						/>
					</section>
				</div>

				<div className="shrink-0 border-neutral-100 border-t bg-white px-5 py-4">
					{error ? (
						<Text as="p" variant="small" className="mb-2" style={{ color: "#dc2626" }}>
							{error.message}
						</Text>
					) : null}
					<Button variant="default" size="lg" fullWidth disabled={!isSavable} onPress={handleSave}>
						{isPending ? "저장 중..." : "일정 저장"}
					</Button>
				</div>
			</div>
		</>
	);
};

export default AddEventSheet;
