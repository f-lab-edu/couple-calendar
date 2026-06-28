import type { WeekDay } from "@/presentation/home/hooks/useHomeCalendar";

interface Props {
	/** 선택일이 속한 주의 7일(일~토). */
	days: WeekDay[];
	/** 날짜 탭 → 그 날짜 선택(다른 달이면 커서도 이동). */
	onSelect: (year: number, month: number, day: number) => void;
}

/** SUN~SAT 대문자 요일 라벨. 일요일은 오렌지 강조. */
const EN_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/**
 * 주간 뷰: 선택일이 속한 한 주(일~토)를 한 줄로 보여준다. 월 뷰 셀과 같은 다크 스킨을
 * 쓰되 셀 높이를 키워 그 주의 일정을 더 잘 보이게 한다. 카루셀(월 전환)과 달리 정적이며,
 * 주 이동은 상단 화살표(주 단위)가 담당한다.
 */
const WeekStrip = ({ days, onSelect }: Props) => {
	return (
		<section className="shrink-0" aria-live="polite">
			<div className="grid grid-cols-7 gap-1.5 px-0.5 pb-2">
				{EN_WEEK.map((d, i) => (
					<div
						key={d}
						className="bold-grotesk text-center"
						style={{
							fontSize: 9.5,
							fontWeight: 700,
							letterSpacing: "0.08em",
							color: i === 0 ? "#F26419" : "var(--text-tertiary)",
						}}
					>
						{d}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 gap-1.5">
				{days.map((wd) => {
					const shown = wd.badges.slice(0, 3);
					const extra = wd.badges.length - shown.length;
					return (
						<button
							key={`${wd.year}-${wd.month}-${wd.day}`}
							type="button"
							onClick={() => onSelect(wd.year, wd.month, wd.day)}
							className="dark-cell flex flex-col items-stretch overflow-hidden text-left"
							style={{
								minHeight: 92,
								borderRadius: 14,
								gap: 3,
								padding: "7px 7px 6px",
								border: wd.isSelected ? "2px solid #f4f4f3" : "2px solid transparent",
								background: "#1a1a1c",
								opacity: wd.inCursorMonth ? 1 : 0.55,
								cursor: "pointer",
							}}
						>
							<span
								className="bold-grotesk"
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: wd.isToday ? "#F26419" : "var(--text-primary)",
								}}
							>
								{wd.day}
							</span>
							<span className="flex min-w-0 flex-col gap-0.5">
								{shown.map((badge) => (
									<span key={`${wd.year}-${wd.month}-${wd.day}-${badge.label}`} className="flex min-w-0 items-center gap-1">
										<span className="shrink-0" style={{ width: 5, height: 5, borderRadius: 1.5, background: badge.color }} />
										<span
											className="bold-grotesk truncate"
											style={{ fontSize: 8.5, fontWeight: 600, color: "var(--text-secondary)" }}
										>
											{badge.label}
										</span>
									</span>
								))}
								{extra > 0 ? (
									<span className="bold-grotesk" style={{ fontSize: 8, fontWeight: 700, color: "var(--text-tertiary)" }}>
										+{extra}
									</span>
								) : null}
							</span>
						</button>
					);
				})}
			</div>
		</section>
	);
};

export default WeekStrip;
