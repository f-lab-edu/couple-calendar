"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { coupleRepository } from "@/composition/couple";
import { userRepository } from "@/composition/user";
import type AuthSession from "@/domain/entities/AuthSession";
import useAppleSignIn from "@/presentation/auth/hooks/useAppleSignIn";
import useEmailSignIn from "@/presentation/auth/hooks/useEmailSignIn";
import { acquireAppleCredential } from "@/presentation/auth/lib/appleIdentityToken";
import { AppleIcon } from "@/presentation/components/icons";
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
		await loginAction(session.user.id, session.accessToken, session.refreshToken);
		const me = await userRepository.getMe();
		// coupleId 존재만으로는 부족하다 — 초대만 만든 "파트너 대기" 상태(isComplete=false)도
		// coupleId가 있으므로 커플 상태에 따라 분기한다.
		//   완성   → 홈
		//   미완성 → 코드 화면(내가 만든 초대 코드 표시)
		//   없음   → 온보딩 처음
		let dest: string = ROUTES.ONBOARDING;
		if (me.coupleId) {
			try {
				const couple = await coupleRepository.getMyCouple();
				dest = couple.isComplete ? ROUTES.HOME : ROUTES.ONBOARDING_CONNECT_CODE_GEN;
			} catch {
				dest = ROUTES.ONBOARDING;
			}
		}
		router.push(dest);
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
		<div
			className="wb-page flex flex-col"
			style={{
				padding: "calc(env(safe-area-inset-top) + 60px) 28px calc(env(safe-area-inset-bottom) + 36px)",
				minHeight: "100dvh",
			}}
		>
			<div className="flex flex-1 flex-col items-center justify-center text-center">
				{/* Brand mark — two interlocking rings */}
				<div style={{ position: "relative", width: 96, height: 64, marginBottom: 28 }}>
					<div
						style={{
							position: "absolute",
							left: 0,
							top: 8,
							width: 56,
							height: 56,
							borderRadius: "50%",
							border: "3px solid var(--ink-800)",
						}}
					/>
					<div
						style={{
							position: "absolute",
							right: 0,
							top: 0,
							width: 56,
							height: 56,
							borderRadius: "50%",
							border: "3px solid var(--action-primary)",
						}}
					/>
				</div>
				<div
					style={{
						fontSize: 32,
						fontWeight: 600,
						letterSpacing: "var(--ls-display)",
						color: "var(--text-brand)",
						lineHeight: 1.15,
					}}
				>
					둘만의 캘린더,
					<br />
					오늘부터.
				</div>
				<div className="wb-body-md" style={{ color: "var(--text-secondary)", marginTop: 14, maxWidth: 260 }}>
					하루를 함께 그려가는 가장 조용한 방법.
				</div>
			</div>

			<div className="flex flex-col" style={{ gap: 14 }}>
				{error && (
					<div className="wb-caption" style={{ textAlign: "center", color: "var(--error-red)" }}>
						{error}
					</div>
				)}

				{showEmail && (
					<form className="flex flex-col" style={{ gap: 8 }} onSubmit={handleEmailLogin}>
						<input
							type="email"
							inputMode="email"
							autoCapitalize="none"
							autoComplete="email"
							placeholder="이메일"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="wb-input"
						/>
						<input
							type="password"
							autoComplete="current-password"
							placeholder="비밀번호 (6자 이상)"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="wb-input"
						/>
						<button
							type="submit"
							disabled={isPending}
							className="wb-btn wb-btn--secondary wb-btn--lg"
							style={{ width: "100%", justifyContent: "center", opacity: isPending ? 0.6 : 1 }}
						>
							이메일로 로그인 / 가입
						</button>
					</form>
				)}

				<button
					type="button"
					disabled={isPending}
					onClick={handleAppleLogin}
					className="wb-btn wb-btn--lg"
					style={{
						width: "100%",
						justifyContent: "center",
						gap: 10,
						padding: 16,
						background: "#f4f4f3",
						color: "#0d0d0e",
						border: "1px solid #f4f4f3",
						opacity: isPending ? 0.6 : 1,
					}}
				>
					<AppleIcon s={18} /> Apple로 계속하기
				</button>

				<button
					type="button"
					className="wb-caption"
					style={{
						textAlign: "center",
						background: "none",
						border: "none",
						color: "var(--text-secondary)",
						textDecoration: "underline",
						cursor: "pointer",
					}}
					onClick={() => setShowEmail((v) => !v)}
				>
					{showEmail ? "이메일 입력 닫기" : "이메일로 계속하기"}
				</button>

				<div className="wb-caption" style={{ textAlign: "center", color: "var(--text-tertiary)" }}>
					계속하면 약관 및 개인정보 처리방침에 동의합니다.
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
