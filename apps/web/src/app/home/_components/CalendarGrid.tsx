import { type Cell, CATEGORY_STYLE, WEEK_LABELS } from "@/app/home/_lib/calendar";
import type { EEventCategory } from "@/domain/entities/Event";

interface Props {
	cells: Cell[];
	selected: number;
	onSelect: (d: number) => void;
	categoriesByDate: Record<number, EEventCategory[]>;
}

const CalendarGrid = ({ cells, selected, onSelect, categoriesByDate }: Props) => (
	<section>
		<div className="grid grid-cols-7 pb-2 text-center text-xs">
			{WEEK_LABELS.map((w, i) => (
				<span key={w} className={i === 0 ? "text-[#e74c3c]" : i === 6 ? "text-[#3b82f6]" : "text-neutral-500"}>
					{w}
				</span>
			))}
		</div>

		<div className="grid grid-cols-7 gap-y-2">
			{cells.map((cell, i) => {
				const weekday = i % 7;
				const categories = cell.inMonth ? categoriesByDate[cell.date] : undefined;
				const isSelected = cell.inMonth && cell.date === selected;
				const baseColor = !cell.inMonth
					? "text-neutral-300"
					: weekday === 0
						? "text-[#e74c3c]"
						: weekday === 6
							? "text-[#3b82f6]"
							: "text-neutral-800";

				return (
					<button
						key={cell.key}
						type="button"
						onClick={() => cell.inMonth && onSelect(cell.date)}
						className="flex h-12 flex-col items-center justify-start pt-1"
					>
						<span
							className={`flex h-7 w-7 items-center justify-center rounded-full text-sm tabular-nums ${
								isSelected ? "bg-[#1f3a2e] font-semibold text-white" : baseColor
							}`}
						>
							{cell.date}
						</span>
						<span className="mt-1 flex h-1.5 items-center gap-0.5">
							{categories?.map((category) => (
								<span
									key={`${cell.key}-${category}`}
									className="h-1.5 w-1.5 rounded-full"
									style={{ backgroundColor: CATEGORY_STYLE[category].color }}
								/>
							))}
						</span>
					</button>
				);
			})}
		</div>
	</section>
);

export default CalendarGrid;
