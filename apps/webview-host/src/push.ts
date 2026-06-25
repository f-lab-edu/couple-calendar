import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export type PushPlatform = 'ios' | 'android';

export const pushPlatform = (): PushPlatform =>
  Platform.OS === 'android' ? 'android' : 'ios';

/**
 * 알림 권한을 요청하고 허용되면 FCM 등록 토큰을 반환한다.
 * 거부/실패 시 null. (네이티브 모듈은 빌드에 Firebase 가 링크돼 있어야 동작)
 */
export async function requestAndGetFcmToken(): Promise<string | null> {
  try {
    const status = await messaging().requestPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL;
    if (!granted) return null;
    return await messaging().getToken();
  } catch (e) {
    console.warn('[push] token fetch failed', e);
    return null;
  }
}

/** FCM 토큰이 회전될 때마다 콜백. 구독 해제 함수를 반환. */
export function onFcmTokenRefresh(cb: (token: string) => void): () => void {
  return messaging().onTokenRefresh(cb);
}

/**
 * 토큰을 WebView 로 전달하는 주입 스크립트를 만든다.
 * 웹은 window.__couplePushToken 을 읽거나 'couple-push-token' 이벤트를 받는다(주입 순서 무관).
 */
export function buildTokenInjection(token: string, platform: PushPlatform): string {
  const payload = JSON.stringify({ token, platform });
  return `(function(){try{window.__couplePushToken=${payload};window.dispatchEvent(new Event('couple-push-token'));}catch(e){}})();true;`;
}
