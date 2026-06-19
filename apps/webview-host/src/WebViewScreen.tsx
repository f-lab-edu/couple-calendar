import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PooledWebView } from 'react-native-instant-webview';

import { WEB_APP_URL } from './config';

function WebViewScreen(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  // Bumping this remounts the PooledWebView to retry a failed load.
  const [reloadNonce, setReloadNonce] = useState(0);

  const fail = () => {
    setLoading(false);
    setError(true);
  };

  const retry = () => {
    setError(false);
    setLoading(true);
    setReloadNonce(n => n + 1);
  };

  return (
    <View style={styles.container}>
      <PooledWebView
        key={reloadNonce}
        source={{ uri: WEB_APP_URL }}
        containerStyle={StyleSheet.absoluteFill}
        // 웹이 로드되기 전 깜빡임/빈 화면을 흰색으로 보이게 한다.
        style={styles.webview}
        // Persist the session cookie across app restarts (iOS uses the shared
        // NSHTTPCookieStorage; Android keeps third-party cookies) so login survives.
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        // The native WebView must not rubber-band/overscroll; only the inner web
        // content scrolls. Keeps fixed headers/FABs from jiggling.
        bounces={false}
        overScrollMode="never"
        onLoadEnd={() => setLoading(false)}
        onError={fail}
        onHttpError={fail}
        onPoolExhausted={() =>
          console.warn(
            '[webview-host] pool exhausted, fell back to WebView',
          )
        }
      />
      {loading && !error && (
        <View
          style={styles.overlay}
          pointerEvents="none"
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {error && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>
            Failed to load {WEB_APP_URL}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retry}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    backgroundColor: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#d00',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#d00',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export { WebViewScreen };
