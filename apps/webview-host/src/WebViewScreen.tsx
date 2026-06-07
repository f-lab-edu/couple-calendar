import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PooledWebView } from 'react-native-instant-webview';

import { WEB_APP_URL } from './config';

function WebViewScreen(): React.JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      <PooledWebView
        source={{ uri: WEB_APP_URL }}
        containerStyle={StyleSheet.absoluteFill}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        onPoolExhausted={() =>
          console.warn(
            '[webview-host] pool exhausted, fell back to WebView',
          )
        }
      />
      {loading && (
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export { WebViewScreen };
