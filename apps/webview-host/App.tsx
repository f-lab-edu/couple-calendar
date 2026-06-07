/**
 * Couple Calendar WebView host app.
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebViewPoolProvider } from 'react-native-instant-webview';

import { WebViewScreen } from './src/WebViewScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <WebViewPoolProvider config={{ poolSize: 3 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <WebViewScreen />
      </SafeAreaView>
    </WebViewPoolProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
