"use client";

import { useEffect, useRef } from "react";
import { registerDeviceToken } from "@/data/apis/DeviceTokenDataSource";

interface InjectedToken {
	token: string;
	platform: string;
}

declare global {
	interface Window {
		__couplePushToken?: InjectedToken;
	}
}

/**
 * 네이티브(webview-host)가 주입한 FCM 토큰을 받아 백엔드에 등록한다.
 * 주입 순서와 무관하게 동작: 마운트 시 window.__couplePushToken 을 읽고,
 * 'couple-push-token' 이벤트도 구독한다. 같은 토큰은 한 번만 등록(중복 POST 방지).
 * 로그인 전(401)이면 조용히 무시되고, 로그인 직후 completeLogin 이 다시 시도한다.
 */
const PushTokenBridge = () => {
	const registeredRef = useRef<string | null>(null);

	useEffect(() => {
		const tryRegister = () => {
			const injected = window.__couplePushToken;
			if (!injected?.token || registeredRef.current === injected.token) return;
			registeredRef.current = injected.token;
			void registerDeviceToken(injected.token, injected.platform).catch(() => {
				// 실패 시 다음 이벤트에서 재시도할 수 있도록 가드 해제.
				registeredRef.current = null;
			});
		};
		tryRegister();
		window.addEventListener("couple-push-token", tryRegister);
		return () => window.removeEventListener("couple-push-token", tryRegister);
	}, []);

	return null;
};

export default PushTokenBridge;
