"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { MswProvider } from "@/data/mocks/MswProvider";
import PushTokenBridge from "@/presentation/push/PushTokenBridge";

export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<MswProvider>
			<QueryClientProvider client={queryClient}>
				<PushTokenBridge />
				{children}
			</QueryClientProvider>
		</MswProvider>
	);
}
