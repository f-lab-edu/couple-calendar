import { ChevronIcon } from "@/presentation/components/icons";

interface Props {
	year: number;
	month: number;
	onPrev: () => void;
	onNext: () => void;
	/** 오늘이 있는 달로 즉시 이동. */
	onToday: () => void;
	/** 현재 보고 있는 달이 오늘의 달인지(맞으면 '오늘' 버튼을 숨긴다). */
	isTodayMonth: boolean;
}

const EN_MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
] as const;

const iconBtn = "flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full";

/**
 * Bold B 월 헤더: 좌우 38px 원형 버튼(#1a1a1c) + 가운데 큰 영문 월 타이틀(40px) + 연도.
 * 오늘의 달이 아닐 때만 가운데 아래에 '오늘' 버튼을 띄워 한 번에 복귀할 수 있게 한다.
 */
const MonthNav = ({ year, month, onPrev, onNext, onToday, isTodayMonth }: Props) => (
	<div className="flex w-full items-center justify-between px-1">
		<button
			type="button"
			aria-label="이전 달"
			onClick={onPrev}
			className={iconBtn}
			style={{ background: "#1a1a1c", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
		>
			<ChevronIcon s={20} dir="left" />
		</button>
		<div className="flex min-w-0 flex-col items-center">
			<div
				className="bold-round leading-none"
				style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" }}
			>
				{EN_MONTHS[month]}
				<span className="sr-only"> {year}</span>
			</div>
			{isTodayMonth ? (
				<span style={{ marginTop: 4, fontSize: 12, fontWeight: 600, color: "var(--text-tertiary)" }}>{year}</span>
			) : (
				<button
					type="button"
					onClick={onToday}
					style={{
						marginTop: 5,
						padding: "3px 10px",
						borderRadius: 999,
						border: "1px solid rgba(255,255,255,0.14)",
						background: "#1a1a1c",
						color: "var(--text-secondary)",
						fontSize: 12,
						fontWeight: 700,
						cursor: "pointer",
					}}
				>
					오늘
				</button>
			)}
		</div>
		<button
			type="button"
			aria-label="다음 달"
			onClick={onNext}
			className={iconBtn}
			style={{ background: "#1a1a1c", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
		>
			<ChevronIcon s={20} />
		</button>
	</div>
);

export default MonthNav;
