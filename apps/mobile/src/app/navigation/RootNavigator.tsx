import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuthStore} from '../../shared/store';
import {useCoupleStore} from '../../shared/store';
import {LoginPage, OnboardingPage, ConnectionPage} from '../../pages';
import {BottomTabNavigator} from './BottomTabNavigator';

export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  Connection: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const {isLoggedIn, isLoading, user} = useAuthStore();
  const {isConnected} = useCoupleStore();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedConnection, setHasCompletedConnection] = useState(false);

  // Reset flow states when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setHasCompletedOnboarding(false);
      setHasCompletedConnection(false);
    }
  }, [isLoggedIn]);

  // Check if user needs to complete onboarding
  const needsOnboarding = isLoggedIn && !hasCompletedOnboarding && !user?.name;

  // Check if user needs to complete connection
  const needsConnection =
    isLoggedIn && !needsOnboarding && !hasCompletedConnection && !isConnected;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF8B94" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginPage} />
      ) : needsOnboarding ? (
        <Stack.Screen name="Onboarding">
          {() => (
            <OnboardingPage
              onComplete={() => setHasCompletedOnboarding(true)}
            />
          )}
        </Stack.Screen>
      ) : needsConnection ? (
        <Stack.Screen name="Connection">
          {() => (
            <ConnectionPage
              onComplete={() => setHasCompletedConnection(true)}
            />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDDE4',
  },
});
