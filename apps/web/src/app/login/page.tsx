"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, Text } from "woosign-system";
import { coupleRepository } from "@/composition/couple";
import { userRepository } from "@/composition/user";
import type AuthSession from "@/domain/entities/AuthSession";
import useAppleSignIn from "@/presentation/auth/hooks/useAppleSignIn";
import useEmailSignIn from "@/presentation/auth/hooks/useEmailSignIn";
import { acquireAppleCredential } from "@/presentation/auth/lib/appleIdentityToken";
import { ROUTES } from "@/shared/constants/routes";
import { loginAction } from "./actions";

const LoginPage = () => {
	const router = useRouter();
	const { mutateAsync: signInWithApple } = useAppleSignIn();
	const { mutateAsync: signInWithEmail } = useEmailSignIn();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showEmail, setShowEmail] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// 인증 방식 무관 공통 후처리: 세션 쿠키 발급 → 커플 연결 여부로 라우팅.
	// coupleId 존재만으로는 부족하다 — 초대만 만든 "파트너 대기" 상태(isComplete=false)도
	// coupleId가 있으므로, 실제로 파트너가 연결된(isComplete) 경우에만 홈으로 보낸다.
	const completeLogin = async (session: AuthSession) => {
		await loginAction(session.user.id, session.accessToken);
		const me = await userRepository.getMe();
		let connected = false;
		if (me.coupleId) {
			try {
				connected = (await coupleRepository.getMyCouple()).isComplete;
			} catch {
				connected = false;
			}
		}
		router.push(connected ? ROUTES.HOME : ROUTES.ONBOARDING);
	};

	const handleAppleLogin = async () => {
		setIsPending(true);
		setError(null);
		try {
			// 1) identityToken 획득 (단일 seam: env 있으면 Apple SDK, 없으면 dev 폴백)
			const credential = await acquireAppleCredential();
			// 2) /api/auth/apple 실호출 → AuthSession(accessToken + user)
			const session = await signInWithApple({
				identityToken: credential.identityToken,
				authorizationCode: credential.authorizationCode,
			});
			await completeLogin(session);
		} catch (e) {
			setError(e instanceof Error ? e.message : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
			setIsPending(false);
		}
	};

	// 이메일/비번 로그인(신규 이메일은 가입 겸용). 테스트·일반 로그인 경로.
	const handleEmailLogin = async (e: FormEvent) => {
		e.preventDefault();
		setIsPending(true);
		setError(null);
		try {
			const session = await signInWithEmail({ email, password });
			await completeLogin(session);
		} catch (err) {
			setError(err instanceof Error ? err.message : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
			setIsPending(false);
		}
	};

	return (
		<div className="flex flex-col min-h-[100dvh] px-4 pt-[env(safe-area-inset-top)]">
			<div className="m-auto text-center">
				<Text as="p" variant="h1" weight="bold">
					둘만의 캘린더, 오늘부터.
				</Text>
				<Text as="p">하루를 함께 그려가는 가장 조용한 방법.</Text>
			</div>
			<div className="sticky bottom-0 flex flex-col gap-4 pb-[calc(env(safe-area-inset-bottom)_+_1rem)]">
				{error && (
					<Text as="span" className="text-center text-red-500">
						{error}
					</Text>
				)}

				{showEmail && (
					<form className="flex flex-col gap-2" onSubmit={handleEmailLogin}>
						<input
							type="email"
							inputMode="email"
							autoCapitalize="none"
							autoComplete="email"
							placeholder="이메일"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base"
						/>
						<input
							type="password"
							autoComplete="current-password"
							placeholder="비밀번호 (6자 이상)"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base"
						/>
						<Button
							className="w-full"
							variant="dark"
							size="lg"
							type="submit"
							disabled={isPending}
							loading={isPending}
						>
							이메일로 로그인 / 가입
						</Button>
					</form>
				)}

				<Button
					className="w-full"
					variant="dark"
					size="lg"
					disabled={isPending}
					loading={isPending}
					onPress={handleAppleLogin}
				>
					Apple로 계속하기
				</Button>

				<button
					type="button"
					className="text-center text-sm text-gray-500 underline"
					onClick={() => setShowEmail((v) => !v)}
				>
					{showEmail ? "이메일 입력 닫기" : "이메일로 계속하기"}
				</button>

				<Text as="span" className="text-center">
					계속하면 약관 및 개인정보 처리방침에 동의합니다.
				</Text>
			</div>
		</div>
	);
};

export default LoginPage;
