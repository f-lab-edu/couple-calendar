const isMockingEnabled = (): boolean => process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

let bootPromise: Promise<void> | null = null;

/**
 * Boots the browser-side MSW worker exactly once per page session.
 * Resolves immediately as a no-op when mocking is disabled or when called
 * outside the browser environment.
 */
export const initMocks = async (): Promise<void> => {
	if (!isMockingEnabled()) return;
	if (typeof window === "undefined") return;

	if (!bootPromise) {
		bootPromise = (async () => {
			const { worker } = await import("./browser");
			await worker.start({
				onUnhandledRequest: "bypass",
				serviceWorker: {
					url: "/mockServiceWorker.js",
				},
			});
		})();
	}

	await bootPromise;
};
