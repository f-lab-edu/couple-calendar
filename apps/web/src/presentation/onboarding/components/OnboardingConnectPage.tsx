import { useRouter } from "next/navigation";
import { ChevronIcon } from "@/presentation/components/icons";
import { ROUTES } from "@/shared/constants/routes";

interface ConnectCardProps {
	title: string;
	description: string;
	tone: "primary" | "secondary";
	onClick: () => void;
}

const ConnectCard = ({ title, description, tone, onClick }: ConnectCardProps) => {
	const isPrimary = tone === "primary";
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				textAlign: "left",
				cursor: "pointer",
				background: isPrimary ? "var(--ink-900)" : "#1a1a1c",
				color: isPrimary ? "#fff" : "var(--text-primary)",
				border: isPrimary ? "1px solid var(--ink-900)" : "1px solid var(--border-default)",
				borderRadius: "var(--radius-lg)",
				padding: "20px 22px",
				fontFamily: "inherit",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "var(--ls-display)" }}>{title}</div>
				<ChevronIcon s={18} />
			</div>
			<div
				style={{
					marginTop: 6,
					fontSize: 13,
					color: isPrimary ? "rgba(255,255,255,0.7)" : "var(--text-secondary)",
					lineHeight: 1.5,
				}}
			>
				{description}
			</div>
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
		<div
			className="flex flex-col"
			style={{
				minHeight: "calc(100dvh - 4px)",
				padding: "24px 24px calc(env(safe-area-inset-bottom) + 28px)",
			}}
		>
			<div
				style={{
					fontSize: 26,
					fontWeight: 600,
					letterSpacing: "var(--ls-display)",
					color: "var(--text-brand)",
					lineHeight: 1.2,
				}}
			>
				둘을 이어볼까요?
			</div>
			<div className="wb-body-sm" style={{ color: "var(--text-secondary)", marginTop: 8 }}>
				한 명이 코드를 만들고, 다른 한 명이 입력하면 끝이에요.
			</div>

			<div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
				<ConnectCard
					title="새 코드 만들기"
					description="6자리 코드를 만들어 상대방에게 알려주세요."
					tone="primary"
					onClick={handleCreate}
				/>
				<ConnectCard
					title="코드 입력하기"
					description="상대방이 만든 코드를 입력해 연결합니다."
					tone="secondary"
					onClick={handleInput}
				/>
			</div>

			<div style={{ flex: 1 }} />

			<div className="wb-caption" style={{ textAlign: "center", color: "var(--text-tertiary)" }}>
				나중에 설정에서 연결해도 괜찮아요.
			</div>
		</div>
	);
};

export default OnboardingConnectPage;
