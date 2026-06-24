"use client";

import { useState } from "react";
import Anniversary from "@/domain/entities/Anniversary";
import useAddAnniversary from "@/presentation/anniversaries/hooks/useAddAnniversary";
import useUpdateAnniversary from "@/presentation/anniversaries/hooks/useUpdateAnniversary";
import { todayDateString } from "@/presentation/anniversaries/lib/anniversaryDisplay";
import { Toggle } from "@/presentation/settings/components/SettingsRows";

interface Props {
	/** 저장 성공 시 호출 (시트 닫기 등). */
	onSuccess: () => void;
	/** 스크롤 본문 영역 className. */
	bodyClassName: string;
	/** 하단 저장 버튼 영역 className. */
	footerClassName: string;
	/** 주어지면 수정 모드: 초기값을 채우고 저장 시 PATCH 경로를 탄다. CUSTOM만 허용. */
	anniversary?: Anniversary | null;
}

/**
 * 기념일 생성/수정 폼. EventForm 패턴을 미러링하여 상태·검증·저장을 한곳에 담고,
 * AddAnniversarySheet / AnniversaryDetailSheet가 레이아웃 래퍼만 달리하여 재사용한다.
 * `anniversary` prop이 주어지면 수정 모드(PATCH)로 동작한다.
 */
const AnniversaryForm = ({ onSuccess, bodyClassName, footerClassName, anniversary }: Props) => {
	const isEditMode = anniversary != null;

	const { mutate: addAnniversary, isPending: isCreating, error: createError } = useAddAnniversary();
	const {
		mutate: updateAnniversary,
		isPending: isUpdating,
		error: updateError,
	} = useUpdateAnniversary();
	const isPending = isCreating || isUpdating;
	const error = createError ?? updateError;

	const [title, setTitle] = useState(anniversary?.title ?? "");
	const [date, setDate] = useState(isEditMode ? anniversary.date.slice(0, 10) : todayDateString());
	const [isRecurring, setIsRecurring] = useState(anniversary?.isRecurring ?? false);
	const [description, setDescription] = useState(anniversary?.description ?? "");

	const isSavable = title.trim().length > 0 && date.length > 0 && !isPending;

	const handleSave = () => {
		if (!isSavable) return;
		const trimmedTitle = title.trim();
		const memo = description.trim() || null;

		if (isEditMode) {
			updateAnniversary(
				{
					id: anniversary.id,
					input: { title: trimmedTitle, date, isRecurring, description: memo },
				},
				{ onSuccess },
			);
		} else {
			// 생성 시 id/coupleId/daysUntil은 서버가 채운다. 폼은 도메인 엔티티로
			// 입력을 표현하되 transport 값은 placeholder로 둔다(레포지토리가 요청으로 변환).
			const draft = new Anniversary("", "", trimmedTitle, date, isRecurring, memo, "CUSTOM", 0);
			addAnniversary(draft, { onSuccess });
		}
	};

	return (
		<>
			<div className={bodyClassName}>
				<section style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="기념일 제목"
						className="w-full"
						style={{
							border: "none",
							background: "transparent",
							padding: "0 0 12px",
							fontSize: 24,
							fontWeight: 600,
							color: "var(--text-brand)",
							outline: "none",
						}}
					/>
				</section>

				<section className="flex flex-col gap-2.5">
					<p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>날짜</p>
					<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="wb-input" />
				</section>

				<section className="flex items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<p style={{ fontSize: 15, color: "var(--text-brand)" }}>매년 반복</p>
						<p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>생일·기념일처럼 매년 돌아오는 날</p>
					</div>
					<Toggle on={isRecurring} onChange={setIsRecurring} />
				</section>

				<section className="flex flex-col gap-2.5">
					<p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>메모</p>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="기억하고 싶은 것을 적어두세요"
						rows={3}
						className="wb-input resize-none"
					/>
				</section>
			</div>

			<div className={footerClassName}>
				{error ? (
					<p className="wb-body-sm mb-2" style={{ color: "var(--error-red)" }}>
						{error.message}
					</p>
				) : null}
				<button
					type="button"
					onClick={handleSave}
					disabled={!isSavable}
					className="wb-btn wb-btn--primary wb-btn--lg"
					style={{ width: "100%", opacity: isSavable ? 1 : 0.5 }}
				>
					{isPending ? "저장 중..." : isEditMode ? "수정 완료" : "기념일 저장"}
				</button>
			</div>
		</>
	);
};

export default AnniversaryForm;
