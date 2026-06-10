"use client";

import { useState } from "react";
import { Button, Input, Switch, Text } from "woosign-system";
import Anniversary from "@/domain/entities/Anniversary";
import useAddAnniversary from "@/presentation/anniversaries/hooks/useAddAnniversary";
import useUpdateAnniversary from "@/presentation/anniversaries/hooks/useUpdateAnniversary";
import { todayDateString } from "@/presentation/anniversaries/lib/anniversaryDisplay";

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
	const [date, setDate] = useState(
		isEditMode ? anniversary.date.slice(0, 10) : todayDateString(),
	);
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
			const draft = new Anniversary(
				"",
				"",
				trimmedTitle,
				date,
				isRecurring,
				memo,
				"CUSTOM",
				0,
			);
			addAnniversary(draft, { onSuccess });
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
							placeholder="기념일 제목"
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
						날짜
					</Text>
					<input
						type="date"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none focus:border-gray-400"
					/>
				</section>

				<section className="flex items-center justify-between">
					<div className="flex flex-col gap-0.5">
						<Text as="p" variant="p" style={{ fontSize: 15, color: "#111827" }}>
							매년 반복
						</Text>
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							생일·기념일처럼 매년 돌아오는 날
						</Text>
					</div>
					<Switch checked={isRecurring} onCheckedChange={setIsRecurring} size="sm" />
				</section>

				<section className="flex flex-col gap-2.5">
					<Text as="p" variant="muted" style={{ fontSize: 12 }}>
						메모
					</Text>
					<Input
						value={description}
						onChangeText={setDescription}
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
					{isPending ? "저장 중..." : isEditMode ? "수정 완료" : "기념일 저장"}
				</Button>
			</div>
		</>
	);
};

export default AnniversaryForm;
