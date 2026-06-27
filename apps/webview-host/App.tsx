/**
 * Couple Calendar WebView host app.
 *
 * @format
 */

import { StatusBar, StyleSheet, View } from 'react-native';
import { WebViewPoolProvider } from 'react-native-instant-webview';

import { WEB_BG_COLOR } from './src/config';
import { WebViewScreen } from './src/WebViewScreen';

function App(): React.JSX.Element {
  // Full-bleed: the WebView fills the entire screen including the notch / home
  // indicator. We intentionally do NOT use SafeAreaView — a padded inset band
  // looked awkward when content scrolled past it. Instead the web app extends
  // edge-to-edge (viewport-fit=cover) and applies env(safe-area-inset-*) padding
  // itself, so content stays clear of the notch while scrolling underneath it.
  // StatusBar is translucent so the page shows through the status-bar area.
  // The web app is a dark theme, so status-bar icons are always light-content.
  return (
    <WebViewPoolProvider config={{ poolSize: 3 }}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <WebViewScreen />
      </View>
    </WebViewPoolProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Safe-area inset padding (notch / home indicator) color. Matches the web
    // app's --bg-page so the edges aren't tinted and no white shows on overscroll.
    backgroundColor: WEB_BG_COLOR,
  },
});

export default App;
