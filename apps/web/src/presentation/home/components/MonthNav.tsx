import { ChevronIcon } from "@/presentation/components/icons";

interface Props {
	year: number;
	month: number;
	onPrev: () => void;
	onNext: () => void;
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
 * Bold B 월 헤더: 좌우 38px 원형 버튼(#1a1a1c) + 가운데 큰 영문 월 타이틀(40px).
 * 연도는 접근성을 위해 시각적으로 숨긴 텍스트로 남겨둔다(스크린리더 맥락).
 */
const MonthNav = ({ year, month, onPrev, onNext }: Props) => (
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
		<div
			className="bold-round"
			style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text-primary)" }}
		>
			{EN_MONTHS[month]}
			<span className="sr-only">
				{" "}
				{year}
			</span>
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
