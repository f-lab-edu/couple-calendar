import { Card, Text } from "woosign-system";
import ChevronRight from "@/shared/components/icon/ChevronRight";

interface Props {
	title: string;
	description?: string;
	destructive?: boolean;
	onClick?: () => void;
}

export const SettingRow = ({ title, description, destructive = false, onClick }: Props) => {
	const titleColor = destructive ? "#dc2626" : "#111827";
	const chevronColor = destructive ? "#dc2626" : "#9ca3af";

	return (
		<Card
			variant="outline"
			fullWidth
			onPress={onClick}
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				borderRadius: 12,
				padding: "16px",
				textAlign: "left",
			}}
		>
			<div className="flex flex-col gap-1">
				<Text as="span" variant="p" weight="semibold" style={{ lineHeight: "22px", color: titleColor }}>
					{title}
				</Text>
				{description && (
					<Text as="span" variant="small" style={{ lineHeight: "20px", color: "#6b7280" }}>
						{description}
					</Text>
				)}
			</div>
			<ChevronRight color={chevronColor} />
		</Card>
	);
};
