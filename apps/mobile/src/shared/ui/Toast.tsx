import React, {useEffect, useRef} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToastStore} from '../store';
import type {ToastType} from '../store';

const BG_BY_TYPE: Record<ToastType, string> = {
  error: '#E53935',
  warning: '#F57C00',
  success: '#43A047',
  info: '#1E88E5',
};

/**
 * 전역 토스트 렌더러.
 * - 화면 최상단 고정
 * - 슬라이드 다운/업 애니메이션
 * - 탭으로 즉시 닫기
 * - 동시에 1개만 표시 (store가 보장)
 */
export const Toast: React.FC = () => {
  const current = useToastStore((s) => s.current);
  const dismissToast = useToastStore((s) => s.dismissToast);

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (current) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [current, translateY, opacity]);

  if (!current) {
    // 애니메이션 종료 후 DOM에서 제거 — pointerEvents로 투명 영역 탭 방지
    return null;
  }

  const backgroundColor = BG_BY_TYPE[current.type];

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}
      pointerEvents="box-none">
      <Animated.View
        style={[
          styles.container,
          {backgroundColor, transform: [{translateY}], opacity},
        ]}
        pointerEvents="auto">
        <TouchableWithoutFeedback onPress={dismissToast}>
          <View style={styles.inner}>
            <Text style={styles.message} numberOfLines={3}>
              {current.message}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  inner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
});
