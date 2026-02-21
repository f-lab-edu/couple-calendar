import React from 'react';
import {View, Text, StyleSheet, Alert, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppTheme} from '../../shared';
import {AppleSignInButton} from '../../features/auth';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const PALETTE = {
  light: {
    bg: '#F5F0EB',
    text: '#2C2420',
    textMuted: '#9A8E85',
    textFaint: '#C4BBB3',
    ring1: '#C4887A',
    ring2: '#8AADA4',
    divider: '#D9D0C7',
  },
  dark: {
    bg: '#1A1816',
    text: '#E8E2D8',
    textMuted: '#8A8078',
    textFaint: '#554E48',
    ring1: '#D4978A',
    ring2: '#8AADA4',
    divider: '#2E2A27',
  },
};

export const LoginPage: React.FC = () => {
  const {isDark} = useAppTheme();
  const c = isDark ? PALETTE.dark : PALETTE.light;

  const handleError = (error: string) => {
    Alert.alert('로그인 실패', error);
  };

  return (
    <View style={[styles.bg, {backgroundColor: c.bg}]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          {/* Upper breathing room */}
          <View style={styles.spacerTop} />

          {/* Hero */}
          <View style={styles.hero}>
            {/* Interlocking rings */}
            <View style={styles.rings}>
              <View style={[styles.ring, styles.ringLeft, {borderColor: c.ring1}]} />
              <View style={[styles.ring, styles.ringRight, {borderColor: c.ring2}]} />
            </View>

            <Text style={[styles.title, {color: c.text}]}>
              Couple
            </Text>
            <Text style={[styles.title, styles.titleSecond, {color: c.text}]}>
              Calendar
            </Text>

            <View style={[styles.divider, {backgroundColor: c.divider}]} />

            <Text style={[styles.subtitle, {color: c.textMuted}]}>
              함께하는 모든 순간을 기록하세요
            </Text>
          </View>

          {/* Bottom */}
          <View style={styles.bottom}>
            <AppleSignInButton onError={handleError} />
            <Text style={[styles.legal, {color: c.textFaint}]}>
              계속 진행하면 이용약관 및 개인정보처리방침에{'\n'}
              동의하는 것으로 간주됩니다.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 36,
  },
  spacerTop: {
    flex: 0.8,
  },

  // --- Hero ---
  hero: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rings: {
    width: 80,
    height: 56,
    marginBottom: 36,
  },
  ring: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  ringLeft: {
    top: 0,
    left: 0,
  },
  ringRight: {
    top: 2,
    right: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 42,
  },
  titleSecond: {
    fontWeight: '600',
    marginBottom: 0,
  },
  divider: {
    width: 24,
    height: 1,
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 1,
    textAlign: 'center',
  },

  // --- Bottom ---
  bottom: {
    flex: 0.9,
    justifyContent: 'flex-end',
    paddingBottom: 28,
  },
  legal: {
    marginTop: 18,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});
