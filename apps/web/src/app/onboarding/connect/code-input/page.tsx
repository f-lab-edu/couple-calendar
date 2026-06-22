"use client";

import { Button, colors, Text } from "woosign-system";
import { CodeInput } from "@/presentation/onboarding/components/CodeInput";
import LogoutLink from "@/presentation/onboarding/components/LogoutLink";
import useConnectByCode from "@/presentation/onboarding/hooks/useConnectByCode";

const CodeInputPage = () => {
	const { code, setCode, codeLength, isComplete, connect, goBack, isPending, error } = useConnectByCode();

	return (
		<div className="flex flex-col min-h-[100dvh] px-5 pt-[calc(env(safe-area-inset-top)_+_1rem)] pb-[calc(env(safe-area-inset-bottom)_+_1.5rem)]">
			<LogoutLink />
			<button
				type="button"
				aria-label="뒤로가기"
				onClick={goBack}
				className="-ml-2 mb-2 flex h-9 w-9 items-center justify-center rounded-full"
			>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M12.5 4.5L7 10L12.5 15.5"
						stroke={colors.foreground}
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>

			<div className="mb-6">
				<Text as="p" variant="large" weight="bold" className="mb-2" color={colors.foreground}>
					상대방의 코드를 입력하세요.
				</Text>
				<Text as="p" variant="small" className="mt-2" color={colors.foreground}>
					6자리 영문 + 숫자 코드입니다.
				</Text>
			</div>

			<CodeInput length={codeLength} value={code} onChange={setCode} />

			{error ? (
				<Text as="p" variant="small" className="mt-3" color="#dc2626">
					{error.message}
				</Text>
			) : null}

			<div className="mt-auto pt-6">
				<Button className="w-full" size="lg" disabled={!isComplete || isPending} onPress={connect}>
					{isPending ? "연결 중..." : "연결하기"}
				</Button>
			</div>
		</div>
	);
};

export default CodeInputPage;
