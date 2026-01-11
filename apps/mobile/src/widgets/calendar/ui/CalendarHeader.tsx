import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {MONTHS} from '../../../shared';

interface CalendarHeaderProps {
  currentDate: Date;
  onMonthChange: (direction: 'prev' | 'next') => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onMonthChange,
}) => {
  const month = MONTHS[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onMonthChange('prev')}>
        <Text style={styles.arrow}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>
        {month} {year}
      </Text>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => onMonthChange('next')}>
        <Text style={styles.arrow}>{'>'}</Text>
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
    color: '#333',
  },
  arrowButton: {
    padding: 8,
  },
  arrow: {
    fontSize: 18,
    color: '#FF8B94',
    fontWeight: '600',
  },
});
