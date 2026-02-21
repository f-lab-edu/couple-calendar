import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import {useAppTheme} from '../../../shared';
import {useAppleAuth} from '../model/useAppleAuth';

interface AppleSignInButtonProps {
  onError?: (error: string) => void;
}

export const AppleSignInButton: React.FC<AppleSignInButtonProps> = ({
  onError,
}) => {
  const {signIn, isLoading, error} = useAppleAuth();
  const {isDark} = useAppTheme();

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const bg = isDark ? '#E8E2D8' : '#2C2420';
  const fg = isDark ? '#1A1816' : '#F5F0EB';

  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: bg}]}
      onPress={signIn}
      disabled={isLoading}
      activeOpacity={0.75}>
      {isLoading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={[styles.appleIcon, {color: fg}]}>{''}</Text>
          <Text style={[styles.text, {color: fg}]}>Apple로 계속하기</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appleIcon: {
    fontSize: 19,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
