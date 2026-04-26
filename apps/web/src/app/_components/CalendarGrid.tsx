import { type Cell, EVENT_DOTS, WEEK_LABELS } from "@/app/_lib/calendar";

interface Props {
	cells: Cell[];
	selected: number;
	onSelect: (d: number) => void;
}

const CalendarGrid = ({ cells, selected, onSelect }: Props) => (
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
				const dots = cell.inMonth ? EVENT_DOTS[cell.date] : undefined;
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
							{dots?.map((d) => (
								<span
									key={`${cell.key}-${d}`}
									className={`h-1.5 w-1.5 rounded-full ${d === "red" ? "bg-[#e74c3c]" : "bg-[#1f7a4a]"}`}
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
