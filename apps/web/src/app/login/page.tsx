"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Text } from "woosign-system";
import { userRepository } from "@/composition/user";
import { acquireAppleCredential } from "@/presentation/auth/lib/appleIdentityToken";
import useAppleSignIn from "@/presentation/auth/hooks/useAppleSignIn";
import { ROUTES } from "@/shared/constants/routes";
import { loginAction } from "./actions";

const LoginPage = () => {
	const router = useRouter();
	const { mutateAsync: signInWithApple } = useAppleSignIn();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

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

			// 3) 세션 쿠키 발급 (userId + accessToken)
			await loginAction(session.user.id, session.accessToken);

			// 4) 온보딩 분기: 커플 연결 여부(coupleId)로 결정
			const me = await userRepository.getMe();
			router.push(me.coupleId ? ROUTES.HOME : ROUTES.ONBOARDING);
		} catch (e) {
			setError(e instanceof Error ? e.message : "로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
			setIsPending(false);
		}
	};

	return (
		<div className="flex flex-col min-h-[100dvh] px-4">
			<div className="m-auto text-center">
				<Text as="p" variant="h1" weight="bold">
					둘만의 캘린더, 오늘부터.
				</Text>
				<Text as="p">하루를 함께 그려가는 가장 조용한 방법.</Text>
			</div>
			<div className="sticky bottom-0 flex flex-col gap-4">
				{error && (
					<Text as="span" className="text-center text-red-500">
						{error}
					</Text>
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
				<Text as="span" className="text-center">
					계속하면 약관 및 개인정보 처리방침에 동의합니다.
				</Text>
			</div>
		</div>
	);
};

export default LoginPage;
