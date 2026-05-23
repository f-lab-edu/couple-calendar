import { Card, Text } from "woosign-system";

interface TimeBlockProps {
	label: string;
	time: string;
	disabled?: boolean;
}

const TimeBlock = ({ label, time, disabled }: TimeBlockProps) => (
	<Card
		variant="outline"
		disabled={disabled}
		onPress={disabled ? undefined : () => {}}
		style={{
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: 4,
			borderRadius: 12,
			padding: "10px 16px",
			textAlign: "left",
			opacity: disabled ? 0.4 : 1,
		}}
	>
		<Text as="span" variant="muted" style={{ fontSize: 11 }}>
			{label}
		</Text>
		<span className="flex items-center gap-1.5 font-mono">
			<Text as="span" weight="semibold" style={{ fontSize: 16, color: "#059669" }}>
				{time}
			</Text>
			<Text as="span" variant="muted" style={{ fontSize: 14 }} aria-hidden>
				⏱
			</Text>
		</span>
	</Card>
);

export default TimeBlock;
