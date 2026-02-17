import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useAppTheme} from '../lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({children, style}) => {
  const {isDark, colors} = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: colors.surface},
        isDark && styles.cardDark,
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: {
    shadowOpacity: 0,
    elevation: 0,
  },
});
