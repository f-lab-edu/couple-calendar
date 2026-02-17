import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {DayCellState, useAppTheme} from '../../../shared';

interface DayCellProps {
  date: Date;
  state: DayCellState;
  onPress: (date: Date) => void;
}

export const DayCell: React.FC<DayCellProps> = ({
  date,
  state,
  onPress,
}) => {
  const {isDark, colors} = useAppTheme();
  const dayNumber = date.getDate();

  const getTextColor = () => {
    switch (state) {
      case 'selected':
        return '#FFF';
      case 'today':
        return colors.accent;
      case 'disabled':
        return colors.textDisabled;
      default:
        return colors.text;
    }
  };

  const getCellBg = () => {
    if (state === 'selected') {
      return colors.accent;
    }
    if (isDark) {
      return colors.calendarCellBg;
    }
    return 'transparent';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDark && styles.containerDark,
        {backgroundColor: getCellBg()},
        state === 'today' && !isDark && styles.todayCellLight,
        state === 'today' && isDark && styles.todayCellDark,
      ]}
      onPress={() => onPress(date)}
      disabled={state === 'disabled'}>
      <Text
        style={[
          styles.dayText,
          {color: getTextColor()},
          state === 'selected' && styles.boldText,
          state === 'today' && styles.boldText,
        ]}>
        {dayNumber}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    margin: 1,
    borderRadius: 8,
  },
  containerDark: {
    borderRadius: 8,
  },
  todayCellLight: {
    borderWidth: 1,
    borderColor: '#FF8B94',
  },
  todayCellDark: {
    borderWidth: 1,
    borderColor: '#FF8B94',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  boldText: {
    fontWeight: '600',
  },
});
