"use client";

import { ChevronIcon } from "@/presentation/components/icons";
import { CodeInput } from "@/presentation/onboarding/components/CodeInput";
import LogoutLink from "@/presentation/onboarding/components/LogoutLink";
import useConnectByCode from "@/presentation/onboarding/hooks/useConnectByCode";

const CodeInputPage = () => {
	const { code, setCode, codeLength, isComplete, connect, goBack, isPending, error } = useConnectByCode();

	return (
		<div
			className="wb-page flex flex-col"
			style={{
				minHeight: "100dvh",
				padding:
					"calc(env(safe-area-inset-top) + 12px) 24px calc(env(safe-area-inset-bottom) + 28px)",
			}}
		>
			<LogoutLink />
			<button
				type="button"
				aria-label="뒤로가기"
				onClick={goBack}
				style={{
					alignSelf: "flex-start",
					background: "none",
					border: "none",
					color: "var(--text-secondary)",
					cursor: "pointer",
					padding: 8,
					marginLeft: -8,
				}}
			>
				<ChevronIcon s={20} dir="left" />
			</button>

			<div style={{ marginTop: 8 }}>
				<div
					style={{
						fontSize: 22,
						fontWeight: 600,
						letterSpacing: "var(--ls-display)",
						color: "var(--text-brand)",
					}}
				>
					상대방의 코드를 입력하세요.
				</div>
				<div className="wb-body-sm" style={{ color: "var(--text-secondary)", marginTop: 6 }}>
					6자리 영문 + 숫자 코드입니다.
				</div>
			</div>

			<div style={{ marginTop: 36 }}>
				<CodeInput length={codeLength} value={code} onChange={setCode} />
			</div>

			{error ? (
				<div className="wb-body-sm" style={{ marginTop: 12, color: "var(--error-red)", textAlign: "center" }}>
					{error.message}
				</div>
			) : null}

			<div style={{ flex: 1 }} />

			<button
				type="button"
				disabled={!isComplete || isPending}
				onClick={connect}
				className="wb-btn wb-btn--primary wb-btn--lg"
				style={{ width: "100%", justifyContent: "center", opacity: !isComplete || isPending ? 0.5 : 1 }}
			>
				{isPending ? "연결 중..." : "연결하기"}
			</button>
		</div>
	);
};

export default CodeInputPage;
