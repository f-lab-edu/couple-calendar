/**
 * 푸시 디바이스 토큰 등록/해제. 네이티브(webview-host)가 WebView로 넘긴 FCM 토큰을
 * 백엔드에 등록한다. BFF(`/api/[...path]`)가 세션의 accessToken을 Bearer로 붙여준다.
 */
export async function registerDeviceToken(token: string, platform: string): Promise<void> {
	const res = await fetch("/api/users/me/device-tokens", {
		method: "POST",
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		body: JSON.stringify({ token, platform }),
	});
	// 401 = 아직 로그인 전 → 조용히 무시(로그인 후 재시도된다).
	if (!res.ok && res.status !== 401) {
		throw new Error(`device token register failed: ${res.status}`);
	}
}

export async function unregisterDeviceToken(token: string): Promise<void> {
	await fetch("/api/users/me/device-tokens", {
		method: "DELETE",
		headers: { "Content-Type": "application/json", Accept: "application/json" },
		body: JSON.stringify({ token }),
	}).catch(() => {});
}
