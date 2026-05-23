/**
 * Next.js instrumentation hook.
 * Boots the MSW node interceptor for SSR / Server Actions / Route Handlers
 * when API mocking is enabled. No-op in production or when the flag is unset.
 */
export async function register() {
	if (process.env.NEXT_PUBLIC_API_MOCKING !== "enabled") return;
	if (process.env.NEXT_RUNTIME !== "nodejs") return;

	const { server } = await import("./src/data/mocks/node");
	server.listen({ onUnhandledRequest: "bypass" });
}
