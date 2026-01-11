import React from 'react';
import {View, StyleSheet} from 'react-native';

interface EventDotProps {
  color: string;
  size?: number;
}

export const EventDot: React.FC<EventDotProps> = ({color, size = 6}) => {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    marginHorizontal: 1,
  },
});
