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
			<head>
				{/* Bold B rounded face: Baloo 2 (Latin) + Jua (Hangul) + Archivo (numerals),
				    Pretendard fallback. Loaded here (not via CSS @import) — see globals.css note. */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Jua&family=Archivo:wght@400;500;600;700;800;900&display=swap"
				/>
				<link
					rel="stylesheet"
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
				/>
			</head>
			<body suppressHydrationWarning>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
