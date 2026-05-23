"use client";

import { type ReactNode, useEffect, useState } from "react";

const isMockingEnabled = process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

interface MswProviderProps {
	children: ReactNode;
}

/**
 * Boots the browser-side MSW worker before rendering children.
 * When mocking is disabled (production or unset env), children render
 * synchronously without any side effects.
 */
export function MswProvider({ children }: MswProviderProps) {
	const [ready, setReady] = useState(!isMockingEnabled);

	useEffect(() => {
		if (!isMockingEnabled) return;

		let cancelled = false;
		(async () => {
			const { initMocks } = await import("./init");
			await initMocks();
			if (!cancelled) setReady(true);
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	if (!ready) return null;
	return <>{children}</>;
}
