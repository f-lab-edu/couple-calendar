import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import type {AnniversaryType} from '../../../shared/types';

interface DdayBadgeProps {
  days: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  type?: AnniversaryType;
}

export const DdayBadge: React.FC<DdayBadgeProps> = ({
  days,
  label,
  size = 'medium',
  type = 'CUSTOM',
}) => {
  const isToday = days === 0;
  const isPast = days < 0;
  const displayText = isToday
    ? 'D-Day'
    : isPast
    ? `D+${Math.abs(days)}`
    : `D-${days}`;

  const currentSize = sizeStyles[size];
  const colorStyle =
    type === 'AUTO' ? styles.textAuto : isToday ? styles.textToday : styles.text;

  return (
    <View style={[styles.container, currentSize.container]}>
      {label && <Text style={[styles.label, currentSize.label]}>{label}</Text>}
      <Text style={[currentSize.text, colorStyle]}>{displayText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  text: {
    fontWeight: '700',
    color: '#FF8B94',
  },
  textToday: {
    fontWeight: '700',
    color: '#FF6B6B',
  },
  textAuto: {
    fontWeight: '700',
    color: '#7EC8E3',
  },
  label: {
    color: '#666666',
    marginBottom: 2,
  },
});

const sizeStyles = {
  small: {
    container: {paddingHorizontal: 8, paddingVertical: 4} as const,
    text: {fontSize: 14} as const,
    label: {fontSize: 10} as const,
  },
  medium: {
    container: {paddingHorizontal: 12, paddingVertical: 6} as const,
    text: {fontSize: 20} as const,
    label: {fontSize: 12} as const,
  },
  large: {
    container: {paddingHorizontal: 16, paddingVertical: 8} as const,
    text: {fontSize: 32} as const,
    label: {fontSize: 14} as const,
  },
};
