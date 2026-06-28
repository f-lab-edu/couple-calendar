import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { WebViewMessageEvent } from 'react-native-webview';
import { PooledWebView, useWebViewPool } from 'react-native-instant-webview';

import { WEB_APP_URL, WEB_BG_COLOR } from './config';
import {
  buildTokenInjection,
  type FcmResult,
  onFcmTokenRefresh,
  pushPlatform,
  requestAndGetFcmToken,
} from './push';

function WebViewScreen(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadNonce, setReloadNonce] = useState(0);

  const pool = useWebViewPool();
  const instanceIdRef = useRef<string | null>(null);
  const resultRef = useRef<FcmResult | null>(null);
  const loadedRef = useRef(false);

  // PooledWebView 의 forwardRef 는 borrow 시점 스냅샷이라 늦게 null 로 고정된다.
  // 대신 풀에서 instanceId 로 실시간 조회해 주입한다.
  const inject = useCallback(
    (script: string) => {
      const id = instanceIdRef.current;
      if (!id || !loadedRef.current) return;
      pool.getWebViewRef(id)?.injectJavaScript(script);
    },
    [pool],
  );

  const pushCurrent = useCallback(() => {
    const token = resultRef.current?.token;
    if (token) inject(buildTokenInjection(token, pushPlatform()));
  }, [inject]);

  useEffect(() => {
    let active = true;
    requestAndGetFcmToken().then(r => {
      if (!active) return;
      resultRef.current = r;
      pushCurrent();
      setTimeout(pushCurrent, 1500);
      setTimeout(pushCurrent, 4000);
    });
    const unsubscribe = onFcmTokenRefresh(token => {
      resultRef.current = { token };
      pushCurrent();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [pushCurrent]);

  const fail = () => {
    setLoading(false);
    setError(true);
  };

  const retry = () => {
    setError(false);
    setLoading(true);
    loadedRef.current = false;
    setReloadNonce(n => n + 1);
  };

  return (
    <View style={styles.container}>
      <PooledWebView
        key={reloadNonce}
        source={{ uri: WEB_APP_URL }}
        containerStyle={StyleSheet.absoluteFill}
        style={styles.webview}
        onBorrowed={id => {
          instanceIdRef.current = id;
        }}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        bounces={false}
        overScrollMode="never"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        allowsBackForwardNavigationGestures
        onMessage={(e: WebViewMessageEvent) => {
          // 웹(홈)이 보낸 위젯 데이터 → 네이티브가 App Group 에 저장 + 위젯 리로드.
          try {
            const msg = JSON.parse(e.nativeEvent.data);
            if (msg?.type === 'widget' && msg.payload) {
              NativeModules.WidgetBridge?.update?.(JSON.stringify(msg.payload));
            }
          } catch {
            // 위젯과 무관한 메시지 — 무시.
          }
        }}
        onLoadEnd={() => {
          setLoading(false);
          loadedRef.current = true;
          pushCurrent();
        }}
        onError={fail}
        onHttpError={fail}
        onPoolExhausted={() =>
          console.warn('[webview-host] pool exhausted, fell back to WebView')
        }
      />
      {loading && !error && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#f4f4f3" />
        </View>
      )}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>Failed to load {WEB_APP_URL}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WEB_BG_COLOR },
  webview: { backgroundColor: WEB_BG_COLOR },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { color: '#d00', textAlign: 'center', paddingHorizontal: 24 },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#d00',
  },
  retryText: { color: '#fff', fontWeight: '600' },
});

export { WebViewScreen };
