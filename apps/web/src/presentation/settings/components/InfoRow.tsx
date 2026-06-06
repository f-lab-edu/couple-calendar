import { Card, Text } from "woosign-system";
import ChevronRight from "@/shared/components/icon/ChevronRight";

interface Props {
	label: string;
	value: string;
	valueMuted?: boolean;
	chevron?: boolean;
	onClick?: () => void;
}

/**
 * 읽기 전용 정보 행 (라벨 좌측 · 값 우측, 선택적 chevron).
 * 편집 가능한 SettingRow와 달리 단순 표시에 쓴다.
 */
export const InfoRow = ({ label, value, valueMuted = false, chevron = false, onClick }: Props) => (
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
		<Text as="span" variant="p" weight="semibold" style={{ lineHeight: "22px", color: "#111827" }}>
			{label}
		</Text>
		<div className="flex items-center gap-1">
			<Text as="span" variant="small" style={{ lineHeight: "20px", color: valueMuted ? "#9ca3af" : "#374151" }}>
				{value}
			</Text>
			{chevron && <ChevronRight color="#9ca3af" />}
		</div>
	</Card>
);
