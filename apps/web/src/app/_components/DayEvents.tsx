import { Badge, Card, Text } from "woosign-system";
import { WEEK_LABELS } from "@/app/_lib/calendar";
import ClockIcon from "@/shared/components/ClockIcon";

interface Props {
	day: number;
	month: number;
}

const DayEvents = ({ day, month }: Props) => {
	const date = new Date(2026, month - 1, day);
	const weekday = WEEK_LABELS[date.getDay()];

	return (
		<section className="mt-2">
			<div className="flex items-center justify-between px-1 pb-2">
				<Text as="p" variant="small" weight="medium" style={{ color: "#111827" }}>
					{month}월 {day}일 {weekday}요일
				</Text>
				<Text as="p" variant="muted" style={{ fontSize: 12 }}>
					1개
				</Text>
			</div>

			<Card
				variant="default"
				fullWidth
				style={{
					position: "relative",
					overflow: "hidden",
					borderRadius: 16,
					padding: "12px 16px",
				}}
			>
				<span className="absolute top-0 bottom-0 left-0 w-1 bg-[#c0392b]" />
				<div className="flex items-center gap-3">
					<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#fde2e2] text-lg">❤️</div>
					<div className="min-w-0 flex-1">
						<Badge variant="secondary">기념일</Badge>
						<Text
							as="p"
							variant="p"
							weight="semibold"
							style={{
								marginTop: 4,
								color: "#111827",
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
							}}
						>
							엄마 생신
						</Text>
						<Text
							as="p"
							variant="muted"
							style={{
								marginTop: 4,
								fontSize: 12,
								display: "flex",
								alignItems: "center",
								gap: 4,
							}}
						>
							<ClockIcon /> 종일
						</Text>
					</div>
				</div>
			</Card>
		</section>
	);
};

export default DayEvents;
