import { useState } from "react";
import { Button, Input, Pill, Switch } from "woosign-system";

const CATEGORIES = [
	{ id: "date", label: "데이트", dot: "#ff6b3d" },
	{ id: "personal", label: "개인", dot: "#3ecf8e" },
	{ id: "anniversary", label: "기념일", dot: "#ef4444" },
	{ id: "etc", label: "기타", dot: "#9ca3af" },
] as const;

const REMINDERS = ["없음", "10분 전", "1시간 전", "하루 전", "일주일 전"] as const;

const EventAddPage = () => {
	const [title, setTitle] = useState("");
	const [category, setCategory] =
		useState<(typeof CATEGORIES)[number]["id"]>("date");
	const [allDay, setAllDay] = useState(false);
	const [reminder, setReminder] =
		useState<(typeof REMINDERS)[number]>("1시간 전");
	const [location, setLocation] = useState("");
	const [memo, setMemo] = useState("");

	const isSavable = title.trim().length > 0;

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-white">
			<header className="flex items-center justify-between px-5 pt-4 pb-3">
				<button
					type="button"
					aria-label="닫기"
					className="grid size-8 place-items-center text-2xl text-neutral-800"
				>
					×
				</button>
				<h1 className="font-medium text-base text-neutral-900">새 일정</h1>
				<Button
					variant="link"
					size="sm"
					disabled={!isSavable}
					onPress={() => {
						/* TODO: save */
					}}
				>
					저장
				</Button>
			</header>

			<div className="flex flex-1 flex-col gap-7 px-5 pt-2 pb-28">
				<section>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="일정 제목"
						className="w-full border-neutral-200 border-b pb-3 font-semibold text-2xl text-neutral-900 placeholder:text-neutral-300 focus:border-neutral-400 focus:outline-none"
					/>
				</section>

				<section className="flex flex-col gap-2.5">
					<p className="text-neutral-500 text-xs">카테고리</p>
					<div className="flex flex-wrap gap-2">
						{CATEGORIES.map((c) => (
							<Pill
								key={c.id}
								active={category === c.id}
								onPress={() => setCategory(c.id)}
							>
								<span className="inline-flex items-center gap-1.5">
									<span
										className="inline-block size-1.5 rounded-full"
										style={{ backgroundColor: c.dot }}
									/>
									{c.label}
								</span>
							</Pill>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-2.5">
					<p className="text-neutral-500 text-xs">날짜</p>
					<button
						type="button"
						className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-neutral-800 text-sm"
					>
						<span>2026. 04. 26 (일)</span>
						<span className="text-neutral-400">›</span>
					</button>
				</section>

				<section className="flex flex-col gap-2.5">
					<div className="flex items-center justify-between">
						<p className="text-neutral-500 text-xs">시간</p>
						<Switch
							checked={allDay}
							onCheckedChange={setAllDay}
							label="종일"
							size="sm"
						/>
					</div>

					<div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
						<TimeBlock label="시작" time="07:00 PM" disabled={allDay} />
						<span className="self-center text-neutral-400">—</span>
						<TimeBlock label="종료" time="09:00 PM" disabled={allDay} />
					</div>
				</section>

				<section className="flex flex-col gap-2.5">
					<p className="text-neutral-500 text-xs">장소</p>
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
					<p className="text-neutral-500 text-xs">알림</p>
					<div className="flex flex-wrap gap-2">
						{REMINDERS.map((r) => (
							<Pill
								key={r}
								active={reminder === r}
								onPress={() => setReminder(r)}
							>
								{r}
							</Pill>
						))}
					</div>
				</section>

				<section className="flex flex-col gap-2.5">
					<p className="text-neutral-500 text-xs">메모</p>
					<Input
						value={memo}
						onChangeText={setMemo}
						placeholder="기억하고 싶은 것을 적어두세요"
						multiline
						numberOfLines={3}
						fullWidth
					/>
				</section>
			</div>

			<div className="sticky bottom-0 border-neutral-100 border-t bg-white px-5 py-4">
				<Button
					variant="default"
					size="lg"
					fullWidth
					disabled={!isSavable}
					onPress={() => {
						/* TODO: save */
					}}
				>
					일정 저장
				</Button>
			</div>
		</div>
	);
};

interface TimeBlockProps {
	label: string;
	time: string;
	disabled?: boolean;
}

const TimeBlock = ({ label, time, disabled }: TimeBlockProps) => (
	<button
		type="button"
		disabled={disabled}
		className={`flex flex-col items-start gap-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-left transition-opacity ${
			disabled ? "opacity-40" : ""
		}`}
	>
		<span className="text-[11px] text-neutral-400">{label}</span>
		<span className="flex items-center gap-1.5 font-mono font-semibold text-base text-emerald-600">
			{time}
			<span aria-hidden className="text-neutral-400 text-sm">
				⏱
			</span>
		</span>
	</button>
);

export default EventAddPage;
