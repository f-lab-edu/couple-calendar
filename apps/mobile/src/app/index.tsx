import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryProvider} from './providers';
import {RootNavigator} from './navigation';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryProvider>
  );
};

export default App;
