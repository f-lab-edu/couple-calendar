import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Couple Calendar",
	description: "Shared calendar for couples",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ko">
			<body>
				<Providers>
					<div className="p-2 flex gap-2">
						<Link href="/">Home</Link>
						<Link href="/about">About</Link>
					</div>
					<hr />
					{children}
				</Providers>
			</body>
		</html>
	);
}
