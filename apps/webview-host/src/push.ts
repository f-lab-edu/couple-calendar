import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export type PushPlatform = 'ios' | 'android';

export const pushPlatform = (): PushPlatform =>
  Platform.OS === 'android' ? 'android' : 'ios';

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export interface FcmResult {
  token?: string;
  /** 진단용 — 실패/상태 사유(웹 디버그 배지에 표시). */
  error?: string;
}

/**
 * 알림 권한 요청 → (iOS) APNs 토큰 대기 → FCM 토큰 획득.
 * 실패해도 throw 하지 않고 error 사유를 담아 반환한다(진단 가시화).
 */
export async function requestAndGetFcmToken(): Promise<FcmResult> {
  try {
    const status = await messaging().requestPermission();
    const granted =
      status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL;
    if (!granted) return { error: `perm-denied:${status}` };

    let apnsSeen = false;
    if (Platform.OS === 'ios') {
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }
      for (let i = 0; i < 16; i += 1) {
        const apns = await messaging().getAPNSToken();
        if (apns) { apnsSeen = true; break; }
        await sleep(500);
      }
      if (!apnsSeen) return { error: 'no-apns-token(8s)' };
    }

    const token = await messaging().getToken();
    if (!token) return { error: 'empty-token' };
    return { token };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { error: `exc:${msg}`.slice(0, 140) };
  }
}

/** FCM 토큰이 회전될 때마다 콜백. 구독 해제 함수를 반환. */
export function onFcmTokenRefresh(cb: (token: string) => void): () => void {
  return messaging().onTokenRefresh(cb);
}

/** 토큰을 WebView 로 전달(window.__couplePushToken + 이벤트). */
export function buildTokenInjection(token: string, platform: PushPlatform): string {
  const payload = JSON.stringify({ token, platform });
  return `(function(){try{window.__couplePushToken=${payload};window.dispatchEvent(new Event('couple-push-token'));}catch(e){}})();true;`;
}
