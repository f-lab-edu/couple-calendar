import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {useAppleAuth} from '../model/useAppleAuth';

interface AppleSignInButtonProps {
  onError?: (error: string) => void;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onError,
}) => {
  const {signIn, isLoading, error} = useAppleAuth();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={signIn}
      disabled={isLoading}
      activeOpacity={0.8}>
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={styles.appleIcon}></Text>
          <Text style={styles.text}>Apple로 계속하기</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    height: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appleIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
