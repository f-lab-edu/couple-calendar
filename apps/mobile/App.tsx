/**
 * Couple Calendar App
 *
 * @format
 */

import {StatusBar, useColorScheme} from 'react-native';
import {App as MainApp} from './src/app';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <MainApp />
    </>
  );
}

export default App;
