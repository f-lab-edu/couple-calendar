import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MONTHS, useAppTheme} from '../../../shared';

interface CalendarHeaderProps {
  currentDate: Date;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onMonthChange,
}) => {
  const {colors} = useAppTheme();
  const month = MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onMonthChange('prev')}>
        <Text style={[styles.arrow, {color: colors.accent}]}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={[styles.title, {color: colors.text}]}>
        {month} {year}
      </Text>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onMonthChange('next')}>
        <Text style={[styles.arrow, {color: colors.accent}]}>{'>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  arrowButton: {
    padding: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: '600',
  },
});
