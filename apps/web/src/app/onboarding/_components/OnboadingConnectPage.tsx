import ChevronRight from "@/shared/components/ChevronRight";
import { ROUTES } from "@/shared/constants/routes";
import { useRouter } from "next/navigation";
import { Text, colors } from "woosign-system";

interface OptionCardProps {
  title: string;
  description: string;
  active?: boolean;
  onClick?: () => void;
}

const OptionCard = ({ title, description, active = false, onClick }: OptionCardProps) => {
  const bg = active ? colors.actionForest : colors.background;
  const titleColor = active ? colors.primaryForeground : colors.foreground;
  const descColor = active ? colors.primaryForeground : colors.foreground;
  const border = active ? "transparent" : colors.border;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left transition-colors"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex flex-col gap-1">
        <Text as="span" variant="p" weight="semibold" style={{ lineHeight: "24px", color: titleColor }}>
          {title}
        </Text>
        <Text as="span" variant="small" style={{ lineHeight: "20px", color: descColor }}>
          {description}
        </Text>
      </div>
      <ChevronRight color={titleColor} />
    </button>
  );
};

const OnboardingConnectPage = () => {
  const router = useRouter();
  
  const handleCreate = () => {
    router.push(ROUTES.ONBOARDING_CONNECT_CODE_GEN);
  };

  const handleInput = () => {
    router.push(ROUTES.ONBOARDING_CONNECT_CODE_INPUT);
  };

  return (
    <div className="flex flex-col min-h-[calc(100dvh-4px)] px-5 pt-6 pb-6">
      <div className="mb-6">
        <Text as="h1" variant="h1" weight="bold" style={{ lineHeight: "40px" }}>
          둘을 이어볼까요?
        </Text>
        <Text as="p" variant="muted" style={{ lineHeight: "20px", marginTop: 4 }}>
          한 명이 코드를 만들고, 다른 한 명이 입력하면 끝이에요.
        </Text>
      </div>

      <div className="flex flex-col gap-3">
        <OptionCard
          title="새 코드 만들기"
          description="6자리 코드를 만들어 상대방에게 알려주세요."
          active
          onClick={handleCreate}
        />
        <OptionCard
          title="코드 입력하기"
          description="상대방이 만든 코드를 입력해 연결합니다."
          onClick={handleInput}
        />
      </div>

      <div className="mt-auto pt-6 text-center">
        <Text as="p" variant="muted" style={{ lineHeight: "20px" }}>
          나중에 설정에서 연결해도 괜찮아요.
        </Text>
      </div>
    </div>
  );
};

export default OnboardingConnectPage;
