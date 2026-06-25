import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { WebView } from 'react-native-webview';
import { PooledWebView } from 'react-native-instant-webview';

import { WEB_APP_URL } from './config';
import {
  buildDebugInjection,
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

  const webRef = useRef<WebView>(null);
  const resultRef = useRef<FcmResult | null>(null);
  const loadedRef = useRef(false);

  const inject = useCallback((script: string) => {
    if (loadedRef.current) webRef.current?.injectJavaScript(script);
  }, []);

  // 현재까지의 결과(토큰 또는 에러)를 웹으로 주입. 여러 번 호출돼도 안전.
  const pushCurrent = useCallback(() => {
    const r = resultRef.current;
    if (!r) return;
    if (r.token) inject(buildTokenInjection(r.token, pushPlatform()));
    else if (r.error) inject(buildDebugInjection(r.error));
  }, [inject]);

  useEffect(() => {
    let active = true;
    requestAndGetFcmToken().then(r => {
      if (!active) return;
      resultRef.current = r;
      pushCurrent();
      // 타이밍 보강: 페이지 전환/지연 대비 약간의 재시도.
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
        ref={webRef}
        source={{ uri: WEB_APP_URL }}
        containerStyle={StyleSheet.absoluteFill}
        style={styles.webview}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        bounces={false}
        overScrollMode="never"
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        // 가장자리 스와이프로 WebView 히스토리 뒤로/앞으로 가기(iOS).
        allowsBackForwardNavigationGestures
        onLoadEnd={() => {
          setLoading(false);
          loadedRef.current = true;
          // 주입 가능 여부 확인 마커 → 웹 배지에 표시(injectJavaScript 동작 검증).
          inject(buildDebugInjection('native-alive'));
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
          <ActivityIndicator size="large" />
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
  container: { flex: 1, backgroundColor: '#fff' },
  webview: { backgroundColor: '#fff' },
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
