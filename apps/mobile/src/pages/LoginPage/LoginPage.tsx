import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {GradientBackground} from '../../shared/ui';
import {AppleSignInButton} from '../../features/auth';

export const LoginPage: React.FC = () => {
  const handleError = (error: string) => {
    Alert.alert('로그인 실패', error);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💑</Text>
          <Text style={styles.title}>커플 캘린더</Text>
          <Text style={styles.subtitle}>함께하는 모든 순간을 기록하세요</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AppleSignInButton onError={handleError} />
          <Text style={styles.disclaimer}>
            계속 진행하면 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로
            간주됩니다.
          </Text>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  disclaimer: {
    marginTop: 16,
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
