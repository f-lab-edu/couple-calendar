import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DayCellState, CalendarEvent, CATEGORY_COLORS} from '../../../shared';
import {EventDot} from './EventDot';

interface DayCellProps {
  date: Date;
  state: DayCellState;
  events: CalendarEvent[];
  onPress: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  state,
  events,
  onPress,
}) => {
  const dayNumber = date.getDate();
  const uniqueCategories = [...new Set(events.map(e => e.category))].slice(
    0,
    3,
  );

  const getTextStyle = () => {
    switch (state) {
      case 'selected':
        return styles.selectedText;
      case 'today':
        return styles.todayText;
      case 'disabled':
        return styles.disabledText;
      default:
        return styles.defaultText;
    }
  };

  const getCellStyle = () => {
    switch (state) {
      case 'selected':
        return styles.selectedCell;
      case 'today':
        return styles.todayCell;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(date)}
      disabled={state === 'disabled'}>
      <View style={[styles.cell, getCellStyle()]}>
        <Text style={[styles.dayText, getTextStyle()]}>{dayNumber}</Text>
      </View>
      {uniqueCategories.length > 0 && (
        <View style={styles.dotsContainer}>
          {uniqueCategories.map((category, index) => (
            <EventDot key={index} color={CATEGORY_COLORS[category]} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    minHeight: 44,
  },
  cell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCell: {
    backgroundColor: '#FF8B94',
  },
  todayCell: {
    borderWidth: 1,
    borderColor: '#FF8B94',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  defaultText: {
    color: '#333',
  },
  selectedText: {
    color: '#FFF',
    fontWeight: '600',
  },
  todayText: {
    color: '#FF8B94',
    fontWeight: '600',
  },
  disabledText: {
    color: '#CCC',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 2,
    height: 6,
  },
});
