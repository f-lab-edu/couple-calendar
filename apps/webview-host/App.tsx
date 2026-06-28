/**
 * Couple Calendar WebView host app.
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { WebViewPoolProvider } from 'react-native-instant-webview';

import { WebViewScreen } from './src/WebViewScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // Full-bleed: the WebView fills the entire screen including the notch / home
  // indicator. We intentionally do NOT use SafeAreaView — a padded inset band
  // looked awkward when content scrolled past it. Instead the web app extends
  // edge-to-edge (viewport-fit=cover) and applies env(safe-area-inset-*) padding
  // itself, so content stays clear of the notch while scrolling underneath it.
  // StatusBar is translucent so the page shows through the status-bar area.
  return (
    <WebViewPoolProvider config={{ poolSize: 3 }}>
      <View style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          translucent
          backgroundColor="transparent"
        />
        <WebViewScreen />
      </View>
    </WebViewPoolProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Safe-area inset padding (notch / home indicator) color. White to match
    // the WebView's default background so the edges aren't tinted.
    backgroundColor: '#fff',
  },
});

export default App;
