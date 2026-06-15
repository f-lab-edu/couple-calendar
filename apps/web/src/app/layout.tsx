import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";
import "woosign-system/fonts.css";

export const metadata: Metadata = {
	title: "Couple Calendar",
	description: "Shared calendar for couples",
};

// viewport-fit=cover 로 노치/홈 인디케이터 영역까지 확장하고
// env(safe-area-inset-*) 값을 활성화한다.
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ko">
			<body suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
