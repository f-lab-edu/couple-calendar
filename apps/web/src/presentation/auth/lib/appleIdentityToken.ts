"use client";

/**
 * Apple identityToken 획득 seam.
 *
 * 단일 진입점으로 토큰 출처를 격리한다.
 * - NEXT_PUBLIC_APPLE_CLIENT_ID(Service ID) 등 env가 모두 설정되어 있으면
 *   Apple JS SDK(AppleID.auth.signIn)로 실제 identityToken을 획득한다.
 * - env가 없으면(로컬/CI mock 환경) dev 폴백 토큰을 반환해
 *   MSW 핸들러(/api/auth/apple)와 E2E 흐름이 동작하도록 한다.
 *
 * ⚠️ DEV FALLBACK: 아래 폴백 토큰은 실제 Apple 토큰이 아니다.
 * MSW mock이 identityToken 존재만 확인하고("new" 포함 시 신규 유저 분기) 응답하므로,
 * 실 서비스 배포 전 반드시 env를 채워 SDK 경로가 동작하도록 해야 한다.
 */

const DEV_FALLBACK_IDENTITY_TOKEN = "dev-mock-identity-token";

export interface AppleCredential {
	identityToken: string;
	authorizationCode?: string;
}

interface AppleAuthResponse {
	authorization?: {
		id_token?: string;
		code?: string;
	};
}

interface AppleIDNamespace {
	auth: {
		init: (config: {
			clientId: string;
			scope: string;
			redirectURI: string;
			usePopup: boolean;
		}) => void;
		signIn: () => Promise<AppleAuthResponse>;
	};
}

declare global {
	interface Window {
		AppleID?: AppleIDNamespace;
	}
}

const APPLE_SDK_SRC =
	"https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

const readAppleConfig = () => {
	const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
	const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI;
	if (!clientId || !redirectURI) return null;
	return { clientId, redirectURI };
};

const loadAppleSdk = (): Promise<void> =>
	new Promise((resolve, reject) => {
		if (window.AppleID) {
			resolve();
			return;
		}
		const existing = document.querySelector<HTMLScriptElement>(`script[src="${APPLE_SDK_SRC}"]`);
		if (existing) {
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener("error", () => reject(new Error("Apple SDK 로드 실패")), {
				once: true,
			});
			return;
		}
		const script = document.createElement("script");
		script.src = APPLE_SDK_SRC;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Apple SDK 로드 실패"));
		document.head.appendChild(script);
	});

/**
 * Apple identityToken(+authorizationCode)을 획득한다.
 * env 미설정 시 dev 폴백 토큰을 반환한다.
 */
export const acquireAppleCredential = async (): Promise<AppleCredential> => {
	const config = readAppleConfig();

	// DEV FALLBACK 경로: env가 없으면 mock 흐름용 토큰을 반환한다.
	if (!config || typeof window === "undefined") {
		return { identityToken: DEV_FALLBACK_IDENTITY_TOKEN };
	}

	await loadAppleSdk();
	if (!window.AppleID) {
		throw new Error("Apple SDK를 사용할 수 없습니다.");
	}

	window.AppleID.auth.init({
		clientId: config.clientId,
		scope: "name email",
		redirectURI: config.redirectURI,
		usePopup: true,
	});

	const result = await window.AppleID.auth.signIn();
	const identityToken = result.authorization?.id_token;
	if (!identityToken) {
		throw new Error("Apple 로그인에서 identityToken을 받지 못했습니다.");
	}

	return {
		identityToken,
		authorizationCode: result.authorization?.code,
	};
};
