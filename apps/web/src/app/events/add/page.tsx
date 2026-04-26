import { useState } from "react";
import { Button, Card, Input, Pill, Switch, Text } from "woosign-system";
import CATEGORIES from "@/shared/constants/events/categories";
import REMINDERS from "@/shared/constants/events/reminders";
import TimeBlock from "./_components/TimeBlock";

const EventAddPage = () => {
	const [title, setTitle] = useState("");
	const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("date");
	const [allDay, setAllDay] = useState(false);
	const [reminder, setReminder] = useState<(typeof REMINDERS)[number]>("1시간 전");
	const [location, setLocation] = useState("");
	const [memo, setMemo] = useState("");

	const isSavable = title.trim().length > 0;

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col bg-white">
			<header className="flex items-center justify-between px-5 pt-4 pb-3">
				<button type="button" aria-label="닫기" className="grid size-8 place-items-center text-2xl text-neutral-800">
					×
				</button>
				<Text as="h1" variant="p" weight="medium" style={{ color: "#111827" }}>
					새 일정
				</Text>
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
					<Input
						value={title}
						onChangeText={setTitle}
						placeholder="일정 제목"
						fullWidth
						style={{
							border: "none",
							borderBottom: "1px solid #e5e7eb",
							borderRadius: 0,
							padding: "0 0 12px",
							fontSize: 24,
							fontWeight: 600,
							color: "#111827",
							backgroundColor: "transparent",
						}}
					/>
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
					<Card
						variant="outline"
						fullWidth
						onPress={() => {
							/* TODO: open date picker */
						}}
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderRadius: 12,
							padding: "12px 16px",
							textAlign: "left",
						}}
					>
						<Text as="span" variant="small" style={{ color: "#1f2937" }}>
							2026. 04. 26 (일)
						</Text>
						<span className="text-neutral-400">›</span>
					</Card>
				</section>

				<section className="flex flex-col gap-2.5">
					<div className="flex items-center justify-between">
						<Text as="p" variant="muted" style={{ fontSize: 12 }}>
							시간
						</Text>
						<Switch checked={allDay} onCheckedChange={setAllDay} label="종일" size="sm" />
					</div>

					<div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2">
						<TimeBlock label="시작" time="07:00 PM" disabled={allDay} />
						<span className="self-center text-neutral-400">—</span>
						<TimeBlock label="종료" time="09:00 PM" disabled={allDay} />
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

export default EventAddPage;
