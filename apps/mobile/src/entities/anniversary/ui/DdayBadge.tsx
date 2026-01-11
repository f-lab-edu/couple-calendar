import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface DdayBadgeProps {
  days: number;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export const DdayBadge: React.FC<DdayBadgeProps> = ({
  days,
  label,
  size = 'medium',
}) => {
  const isToday = days === 0;
  const isPast = days < 0;
  const displayText = isToday ? 'D-Day' : isPast ? `D+${Math.abs(days)}` : `D-${days}`;

  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      label: styles.labelSmall,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      label: styles.labelMedium,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      label: styles.labelLarge,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, currentSize.container]}>
      {label && <Text style={[styles.label, currentSize.label]}>{label}</Text>}
      <Text style={[styles.text, currentSize.text, isToday && styles.textToday]}>
        {displayText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  containerMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    fontWeight: '700',
    color: '#FF8B94',
  },
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 20,
  },
  textLarge: {
    fontSize: 32,
  },
  textToday: {
    color: '#FF6B6B',
  },
  label: {
    color: '#666666',
    marginBottom: 2,
  },
  labelSmall: {
    fontSize: 10,
  },
  labelMedium: {
    fontSize: 12,
  },
  labelLarge: {
    fontSize: 14,
  },
});
