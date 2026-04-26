import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";
import "woosign-system/fonts.css";

export const metadata: Metadata = {
	title: "Couple Calendar",
	description: "Shared calendar for couples",
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
