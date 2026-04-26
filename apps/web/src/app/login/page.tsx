import { useRouter } from "next/navigation";
import { Button, Text } from "woosign-system";

const LoginPage = () => {
	const router = useRouter();

	const handleAppleLogin = () => {
		router.push("/onboarding");
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
				<Button className="w-full" variant="dark" size="lg" onPress={handleAppleLogin}>
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
