"use client";

import { useState } from "react";
import { Button, Input, Pill, Switch, Text } from "woosign-system";
import type Event from "@/domain/entities/Event";
import useCreateEvent from "@/presentation/events/hooks/useCreateEvent";
import useUpdateEvent from "@/presentation/events/hooks/useUpdateEvent";
import { isAllDay } from "@/presentation/events/lib/eventDisplay";
import {
	allDayEndIso,
	allDayStartIso,
	CATEGORY_TO_DTO,
	type CategoryId,
	DTO_TO_CATEGORY,
	isoToDateString,
	isoToTimeString,
	todayString,
	toKstIso,
} from "@/presentation/events/lib/eventForm";
import CATEGORIES from "@/shared/constants/events/categories";
import REMINDERS from "@/shared/constants/events/reminders";

interface Props {
	/** 저장 성공 시 호출 (페이지는 라우팅, 시트는 닫기). */
	onSuccess: () => void;
	/** 스크롤 본문 영역 className. 페이지/시트 레이아웃 차이를 흡수한다. */
	bodyClassName: string;
	/** 하단 저장 버튼 영역 className. */
	footerClassName: string;
	/** 주어지면 수정 모드: 초기값을 채우고 저장 시 PATCH 경로를 탄다. */
	event?: Event | null;
}

/**
 * 일정 생성/수정 폼의 상태·검증·저장 로직과 입력 필드를 모두 담는 공통 컴포넌트.
 * 풀페이지(`/events/add`)와 바텀시트(`AddEventSheet`/`EventDetailSheet`)가
 * 레이아웃 래퍼만 달리하여 재사용한다. `event` prop이 주어지면 수정 모드로 동작한다.
 */
const EventForm = ({ onSuccess, bodyClassName, footerClassName, event }: Props) => {
	const isEditMode = event != null;
	const editAllDay = isEditMode ? isAllDay(event) : false;

	const { mutate: createEvent, isPending: isCreating, error: createError } = useCreateEvent();
	const { mutate: updateEvent, isPending: isUpdating, error: updateError } = useUpdateEvent();
	const isPending = isCreating || isUpdating;
	const error = createError ?? updateError;

	const [title, setTitle] = useState(event?.title ?? "");
	const [category, setCategory] = useState<CategoryId>(
		isEditMode ? DTO_TO_CATEGORY[event.category] : "date",
	);
	const [date, setDate] = useState(isEditMode ? isoToDateString(event.startTime) : todayString());
	const [startTime, setStartTime] = useState(
		isEditMode ? isoToTimeString(event.startTime) : "19:00",
	);
	const [endTime, setEndTime] = useState(isEditMode ? isoToTimeString(event.endTime) : "21:00");
	const [allDay, setAllDay] = useState(editAllDay);
	const [reminder, setReminder] = useState<(typeof REMINDERS)[number]>("1시간 전");
	const [location, setLocation] = useState(event?.location ?? "");
	const [memo, setMemo] = useState(event?.description ?? "");

	const isSavable = title.trim().length > 0 && date.length > 0 && !isPending;

	const handleSave = () => {
		if (!isSavable) return;
		const payload = {
			title: title.trim(),
			startTime: allDay ? allDayStartIso(date) : toKstIso(date, startTime),
			endTime: allDay ? allDayEndIso(date) : toKstIso(date, endTime),
			category: CATEGORY_TO_DTO[category],
			description: memo.trim() || null,
			location: location.trim() || null,
		};

		if (isEditMode) {
			updateEvent({ id: event.id, input: payload }, { onSuccess });
		} else {
			createEvent(payload, { onSuccess });
		}
	};

	return (
		<>
			<div className={bodyClassName}>
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
							className="w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-base text-gray-900 outline-none focus:border-gray-400 disabled:opacity-40"
						/>
						<span className="text-neutral-400">—</span>
						<input
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							disabled={allDay}
							className="w-full min-w-0 appearance-none rounded-xl border border-gray-200 bg-white px-3 py-3 text-center text-base text-gray-900 outline-none focus:border-gray-400 disabled:opacity-40"
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

			<div className={footerClassName}>
				{error ? (
					<Text as="p" variant="small" className="mb-2" style={{ color: "#dc2626" }}>
						{error.message}
					</Text>
				) : null}
				<Button variant="default" size="lg" fullWidth disabled={!isSavable} onPress={handleSave}>
					{isPending ? "저장 중..." : isEditMode ? "수정 완료" : "일정 저장"}
				</Button>
			</div>
		</>
	);
};

export default EventForm;
