import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export type PushPlatform = 'ios' | 'android';

export const pushPlatform = (): PushPlatform =>
  Platform.OS === 'android' ? 'android' : 'ios';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/**
 * 알림 권한을 요청하고 허용되면 FCM 등록 토큰을 반환한다(거부/실패 시 null).
 *
 * iOS 주의: getToken() 은 APNs 디바이스 토큰이 먼저 설정돼 있어야 한다. 권한 직후 바로
 * 호출하면 "No APNS token specified" 로 실패하므로, remote messages 등록 후 APNs 토큰이
 * 들어올 때까지(최대 ~5s) 폴링한 뒤 getToken 을 호출한다.
 */
export async function requestAndGetFcmToken(): Promise<string | null> {
  try {
    const status = await messaging().requestPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL;
    if (!granted) {
      console.warn('[push] permission not granted:', status);
      return null;
    }

    if (Platform.OS === 'ios') {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      // APNs 토큰이 준비될 때까지 폴링(없으면 getToken 이 실패).
      for (let i = 0; i < 10; i += 1) {
        const apns = await messaging().getAPNSToken();
        if (apns) break;
        await sleep(500);
      }
    }

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
