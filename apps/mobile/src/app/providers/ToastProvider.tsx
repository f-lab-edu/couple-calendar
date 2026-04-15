import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Toast} from '../../shared/ui';

interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * 전역 토스트를 children 위에 렌더링하는 Provider.
 * Toast 컴포넌트는 useToastStore를 구독하여 스스로 표시/숨김.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
  return (
    <View style={styles.root}>
      {children}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
});
