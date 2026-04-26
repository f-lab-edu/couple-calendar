import { Text } from "woosign-system";

interface Props {
	year: number;
	month: number;
	onPrev: () => void;
	onNext: () => void;
}

const MonthNav = ({ year, month, onPrev, onNext }: Props) => (
	<div className="flex items-center gap-2 text-sm">
		<button
			type="button"
			aria-label="이전 달"
			onClick={onPrev}
			className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-neutral-900"
		>
			‹
		</button>
		<Text
			as="span"
			variant="small"
			weight="medium"
			style={{ color: "#111827", fontVariantNumeric: "tabular-nums" }}
		>
			{year}. {month + 1}월
		</Text>
		<button
			type="button"
			aria-label="다음 달"
			onClick={onNext}
			className="flex h-7 w-7 items-center justify-center rounded text-neutral-500 hover:text-neutral-900"
		>
			›
		</button>
	</div>
);

export default MonthNav;
