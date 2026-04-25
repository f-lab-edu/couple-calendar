const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export type ClientFetchOptions = RequestInit & { authToken?: string };

export async function clientFetch<T>(path: string, options: ClientFetchOptions = {}): Promise<T> {
	const { authToken, headers, ...rest } = options;
	const response = await fetch(`${API_BASE_URL}${path}`, {
		...rest,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
			...headers,
		},
	});

	if (!response.ok) {
		throw new Error(`HTTP ${response.status} ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}
