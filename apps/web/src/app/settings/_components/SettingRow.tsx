import { Text } from "woosign-system";
import ChevronRight from "@/shared/components/ChevronRight";

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
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-4 text-left"
      style={{ border: "1px solid #e5e7eb" }}
    >
      <div className="flex flex-col gap-1">
        <Text
          as="span"
          variant="p"
          weight="semibold"
          style={{ lineHeight: "22px", color: titleColor }}
        >
          {title}
        </Text>
        {description && (
          <Text
            as="span"
            variant="small"
            style={{ lineHeight: "20px", color: "#6b7280" }}
          >
            {description}
          </Text>
        )}
      </div>
      <ChevronRight color={chevronColor} />
    </button>
  );
};
