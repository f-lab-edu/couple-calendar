import { type Cell, CATEGORY_STYLE, todayParts } from "@/presentation/home/lib/calendar";
import type { EEventCategory } from "@/domain/entities/Event";

interface Props {
	/** 0-based 월(현재 그리드가 그리는 달). 오늘 강조를 정확히 판정하기 위해 사용. */
	year: number;
	month: number;
	cells: Cell[];
	selected: number;
	/** 월 전환 방향(이전/다음). 슬라이드 애니메이션 방향 결정. */
	navigationDirection: "prev" | "next" | null;
	onSelect: (d: number) => void;
	categoriesByDate: Record<number, EEventCategory[]>;
}

/** SUN~SAT 대문자 요일 라벨(Archivo). 일요일은 오렌지 강조. */
const EN_WEEK = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

/** 월 전환 방향별 슬라이드 애니메이션 클래스(globals.css). */
const ANIMATION_CLASS = {
	prev: "animate-calendar-slide-from-left",
	next: "animate-calendar-slide-from-right",
} as const;

/**
 * Bold B 둥근 다크 셀 달력. 데이터 계약(cells / categoriesByDate / selected)은
 * 그대로 유지하고 시각만 다크 셀로 교체한다. 각 셀은 날짜 숫자 + 카테고리 점·라벨을
 * 최대 2개 보여주고, 그 이상은 +N으로 표시한다. 월 전환 시 방향에 맞춰 슬라이드한다.
 */
const CalendarGrid = ({ year, month, cells, selected, navigationDirection, onSelect, categoriesByDate }: Props) => {
	const today = todayParts();
	const isTodayMonth = today.year === year && today.month === month;

	return (
		<section
			className={`shrink-0 ${navigationDirection ? ANIMATION_CLASS[navigationDirection] : ""}`}
			aria-live="polite"
		>
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
				{cells.map((cell) => {
					const categories = cell.inMonth ? categoriesByDate[cell.date] : undefined;
					const isSelected = cell.inMonth && cell.date === selected;
					const isToday = cell.inMonth && isTodayMonth && cell.date === today.day;
					const shown = categories?.slice(0, 2) ?? [];
					const extra = (categories?.length ?? 0) - shown.length;

					return (
						<button
							key={cell.key}
							type="button"
							onClick={() => cell.inMonth && onSelect(cell.date)}
							className="dark-cell flex flex-col items-stretch overflow-hidden text-left"
							style={{
								minHeight: 66,
								borderRadius: 14,
								gap: 3,
								padding: "7px 7px 6px",
								border: isSelected ? "2px solid #f4f4f3" : "2px solid transparent",
								background: cell.inMonth ? "#1a1a1c" : "transparent",
								cursor: cell.inMonth ? "pointer" : "default",
							}}
						>
							<span
								className="bold-grotesk"
								style={{
									fontSize: 14,
									fontWeight: 700,
									color: !cell.inMonth
										? "var(--text-tertiary)"
										: isToday
											? "#F26419"
											: "var(--text-primary)",
								}}
							>
								{cell.date}
							</span>
							<span className="flex min-w-0 flex-col gap-0.5">
								{shown.map((category) => {
									const style = CATEGORY_STYLE[category];
									return (
										<span
											key={`${cell.key}-${category}`}
											className="flex min-w-0 items-center gap-1"
											style={{ opacity: cell.inMonth ? 1 : 0.4 }}
										>
											<span
												className="shrink-0"
												style={{ width: 5, height: 5, borderRadius: 1.5, background: style.color }}
											/>
											<span
												className="bold-grotesk truncate"
												style={{ fontSize: 8.5, fontWeight: 600, color: "var(--text-secondary)" }}
											>
												{style.label}
											</span>
										</span>
									);
								})}
								{extra > 0 ? (
									<span
										className="bold-grotesk"
										style={{ fontSize: 8, fontWeight: 700, color: "var(--text-tertiary)" }}
									>
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

export default CalendarGrid;
