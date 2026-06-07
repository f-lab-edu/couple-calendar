import { vi } from "vitest";

interface FetchMockInit {
	ok?: boolean;
	status?: number;
	statusText?: string;
}

/**
 * Replace global `fetch` with a vi.fn that resolves a minimal Response-like
 * object. `unstubGlobals: true` in vitest.config restores it after each test.
 *
 * Returns the mock so callers can assert on the request (url, method, body).
 */
export const stubFetchJson = (data: unknown, init: FetchMockInit = {}) => {
	const fetchMock = vi.fn<typeof fetch>(
		async () =>
			({
				ok: init.ok ?? true,
				status: init.status ?? 200,
				statusText: init.statusText ?? "OK",
				json: async () => data,
			}) as unknown as Response,
	);
	vi.stubGlobal("fetch", fetchMock);
	return fetchMock;
};

/** Stub fetch with a non-2xx response whose json() yields `body`. */
export const stubFetchError = (
	status: number,
	statusText: string,
	body: unknown = {},
) => stubFetchJson(body, { ok: false, status, statusText });
