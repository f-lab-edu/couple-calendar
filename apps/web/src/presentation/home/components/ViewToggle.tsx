import { Tabs } from "woosign-system";

export type CalendarView = "month" | "week" | "list";

interface Props {
	value: CalendarView;
	onChange: (v: CalendarView) => void;
}

const ITEMS = [
	{ key: "month", label: "월" },
];

const ViewToggle = ({ value, onChange }: Props) => (
	<Tabs items={ITEMS} value={value} onChange={(k) => onChange(k as CalendarView)} />
);

export default ViewToggle;
