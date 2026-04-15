import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryProvider, ToastProvider} from './providers';
import {RootNavigator} from './navigation';

export const App: React.FC = () => {
  return (
    <QueryProvider>
      <SafeAreaProvider>
        <ToastProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </QueryProvider>
  );
};

export default App;
