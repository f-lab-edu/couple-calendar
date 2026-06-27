"use client";

import { useState } from "react";
import { PinIcon } from "@/presentation/components/icons";
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
import { CATEGORY_STYLE } from "@/presentation/home/lib/calendar";
import CATEGORIES from "@/shared/constants/events/categories";
import REMINDERS from "@/shared/constants/events/reminders";
import useCoupleProfile from "@/presentation/settings/hooks/useCoupleProfile";

interface Props {
	/** 저장 성공 시 호출 (페이지는 라우팅, 시트는 닫기). */
	onSuccess: () => void;
	/** 스크롤 본문 영역 className. 페이지/시트 레이아웃 차이를 흡수한다. */
	bodyClassName: string;
	/** 하단 저장 버튼 영역 className. */
	footerClassName: string;
	/** 주어지면 수정 모드: 초기값을 채우고 저장 시 PATCH 경로를 탄다. */
	event?: Event | null;
	/** 생성 모드 초기 날짜(`yyyy-mm-dd`). 없으면 오늘. 달력에서 선택한 날을 미리 채울 때 사용. */
	initialDate?: string;
	/** 알림 행 노출 여부. 바텀시트(시트)는 숨기고 풀페이지는 보여준다(디자인 원본). */
	showReminder?: boolean;
}

const fieldLabel = "block text-[12px] font-semibold uppercase tracking-[0.04em]";

/**
 * 일정 생성/수정 폼의 상태·검증·저장 로직과 입력 필드를 모두 담는 공통 컴포넌트.
 * 풀페이지(`/events/add`)와 바텀시트(`AddEventSheet`/`EventDetailSheet`)가
 * 레이아웃 래퍼만 달리하여 재사용한다. `event` prop이 주어지면 수정 모드로 동작한다.
 * Bold B 다크 스킨: 시각만 교체하고 저장/카테고리/시간/알림 계약은 그대로 유지한다.
 */
const EventForm = ({ onSuccess, bodyClassName, footerClassName, event, initialDate, showReminder = true }: Props) => {
	const isEditMode = event != null;
	const editAllDay = isEditMode ? isAllDay(event) : false;

	const { mutate: createEvent, isPending: isCreating, error: createError } = useCreateEvent();
	const { mutate: updateEvent, isPending: isUpdating, error: updateError } = useUpdateEvent();
	const isPending = isCreating || isUpdating;
	const error = createError ?? updateError;

	const { data: profile } = useCoupleProfile();
	const myName = profile?.me.name ?? "나";

	const [title, setTitle] = useState(event?.title ?? "");
	const [category, setCategory] = useState<CategoryId>(isEditMode ? DTO_TO_CATEGORY[event.category] : "date");
	const [date, setDate] = useState(isEditMode ? isoToDateString(event.startTime) : (initialDate ?? todayString()));
	const [startTime, setStartTime] = useState(isEditMode ? isoToTimeString(event.startTime) : "19:00");
	const [endTime, setEndTime] = useState(isEditMode ? isoToTimeString(event.endTime) : "21:00");
	const [allDay, setAllDay] = useState(editAllDay);
	const [reminder, setReminder] = useState<(typeof REMINDERS)[number]>("1시간 전");
	const [location, setLocation] = useState(event?.location ?? "");
	const [memo, setMemo] = useState(event?.description ?? "");

	const isSavable = title.trim().length > 0 && date.length > 0 && !isPending;
	// 작성자 안내 카드 틴트는 선택 카테고리 색에서 가져온다.
	const catStyle = CATEGORY_STYLE[CATEGORY_TO_DTO[category]];

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

	const timeInputCls =
		"w-full min-w-0 appearance-none rounded-xl px-3 py-3 text-center text-base outline-none disabled:opacity-40";
	const timeInputStyle = {
		background: "#1a1a1c",
		color: "var(--text-primary)",
		border: "1px solid rgba(255,255,255,0.14)",
	};

	return (
		<>
			<div className={bodyClassName}>
				{/* 제목 큰 인풋 */}
				<section style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="일정 제목"
						aria-label="일정 제목"
						className="w-full bg-transparent outline-none"
						style={{
							border: "none",
							padding: "0 0 12px",
							fontSize: 26,
							fontWeight: 700,
							color: "var(--text-primary)",
						}}
					/>
				</section>

				{/* 카테고리 pill */}
				<section className="flex flex-col gap-2.5">
					<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
						카테고리
					</span>
					<div className="flex flex-wrap gap-2">
						{CATEGORIES.map((c) => {
							const style = CATEGORY_STYLE[CATEGORY_TO_DTO[c.id]];
							const active = category === c.id;
							return (
								<button
									key={c.id}
									type="button"
									onClick={() => setCategory(c.id)}
									className="inline-flex items-center gap-1.5"
									style={{
										padding: "8px 14px",
										borderRadius: 999,
										fontSize: 13,
										fontWeight: active ? 600 : 500,
										cursor: "pointer",
										background: active ? style.softBg : "#1a1a1c",
										color: active ? style.color : "var(--text-primary)",
										border: `1px solid ${active ? style.color : "rgba(255,255,255,0.12)"}`,
									}}
								>
									<span className="inline-block" style={{ width: 6, height: 6, borderRadius: "50%", background: style.color }} />
									{c.label}
								</button>
							);
						})}
					</div>
				</section>

				{/* 날짜 */}
				<section className="flex flex-col gap-2.5">
					<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
						날짜
					</span>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="wb-input"
					/>
				</section>

				{/* 시간 토글 + TimeBox */}
				<section className="flex flex-col gap-2.5">
					<div className="flex items-center justify-between">
						<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
							시간
						</span>
						<button
							type="button"
							role="switch"
							aria-checked={allDay}
							aria-label="종일"
							onClick={() => setAllDay((v) => !v)}
							className="flex cursor-pointer items-center gap-2"
							style={{ background: "transparent", border: "none", padding: 0 }}
						>
							<span style={{ fontSize: 13, color: "var(--text-secondary)" }}>종일</span>
							<span
								className="relative inline-flex shrink-0 items-center"
								style={{
									width: 44,
									height: 26,
									borderRadius: 999,
									background: allDay ? "#F26419" : "rgba(255,255,255,0.18)",
									transition: "background 200ms ease",
								}}
							>
								<span
									className="absolute"
									style={{
										width: 22,
										height: 22,
										borderRadius: "50%",
										background: "#fff",
										top: 2,
										left: allDay ? 20 : 2,
										transition: "left 200ms ease",
									}}
								/>
							</span>
						</button>
					</div>

					<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
						<input
							type="time"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							disabled={allDay}
							aria-label="시작 시간"
							className={timeInputCls}
							style={timeInputStyle}
						/>
						<span style={{ color: "var(--text-tertiary)" }}>—</span>
						<input
							type="time"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							disabled={allDay}
							aria-label="종료 시간"
							className={timeInputCls}
							style={timeInputStyle}
						/>
					</div>
				</section>

				{/* 장소 (핀 prefix) */}
				<section className="flex flex-col gap-2.5">
					<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
						장소
					</span>
					<div className="relative">
						<span
							aria-hidden
							className="-translate-y-1/2 absolute top-1/2 left-3.5"
							style={{ color: "var(--text-tertiary)" }}
						>
							<PinIcon s={16} />
						</span>
						<input
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder="예: 성수동 어니언"
							aria-label="장소"
							className="wb-input"
							style={{ paddingLeft: 38 }}
						/>
					</div>
				</section>

				{/* 알림 pill (시트에서는 숨김) */}
				{showReminder ? (
					<section className="flex flex-col gap-2.5">
						<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
							알림
						</span>
						<div className="flex flex-wrap gap-2">
							{REMINDERS.map((r) => {
								const active = reminder === r;
								return (
									<button
										key={r}
										type="button"
										onClick={() => setReminder(r)}
										className={active ? "wb-pill wb-pill--active" : "wb-pill"}
										style={{ cursor: "pointer" }}
									>
										{r}
									</button>
								);
							})}
						</div>
					</section>
				) : null}

				{/* 메모 */}
				<section className="flex flex-col gap-2.5">
					<span className={fieldLabel} style={{ color: "var(--text-secondary)" }}>
						메모
					</span>
					<textarea
						value={memo}
						onChange={(e) => setMemo(e.target.value)}
						placeholder="기억하고 싶은 것을 적어두세요"
						rows={3}
						aria-label="메모"
						className="wb-input"
						style={{ resize: "none", lineHeight: 1.5 }}
					/>
				</section>

				{/* 작성자 안내 카드 (카테고리 틴트) */}
				<section
					style={{
						borderRadius: 12,
						padding: "12px 14px",
						background: catStyle.softBg,
						color: catStyle.color,
						fontSize: 13,
						fontWeight: 500,
					}}
				>
					{myName}님이 작성하는 일정이에요.
				</section>
			</div>

			<div className={footerClassName}>
				{error ? (
					<p className="mb-2" style={{ fontSize: 13, color: "#ff7a6b" }}>
						{error.message}
					</p>
				) : null}
				<button
					type="button"
					disabled={!isSavable}
					onClick={handleSave}
					className="wb-btn wb-btn--primary wb-btn--lg w-full"
					style={{ opacity: isSavable ? 1 : 0.4 }}
				>
					{isPending ? "저장 중..." : isEditMode ? "수정 완료" : "일정 저장"}
				</button>
			</div>
		</>
	);
};

export default EventForm;
