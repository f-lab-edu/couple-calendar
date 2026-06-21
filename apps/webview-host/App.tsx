/**
 * Couple Calendar WebView host app.
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { WebViewPoolProvider } from 'react-native-instant-webview';

import { WebViewScreen } from './src/WebViewScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  // SafeAreaProvider is required for SafeAreaView to compute insets; without it
  // SafeAreaView renders full-bleed and the WebView overlaps the status bar /
  // home indicator. The padded inset area uses the web app's background color
  // so it blends with the rendered page.
  return (
    <SafeAreaProvider>
      <WebViewPoolProvider config={{ poolSize: 3 }}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <WebViewScreen />
        </SafeAreaView>
      </WebViewPoolProvider>
    </SafeAreaProvider>
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
