import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from '../../../shared/ui';
import {
  WEEKDAYS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  useAppTheme,
} from '../../../shared';
import type {EventMap} from '../../../shared';
import {DayCell} from '../../../entities/calendar';
import {CalendarHeader} from './CalendarHeader';

interface CalendarWidgetProps {
  currentDate: Date;
  selectedDate: Date;
  events: EventMap;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  currentDate,
  selectedDate,
  onMonthChange,
  onDateSelect,
}) => {
  const today = new Date();
  const {colors} = useAppTheme();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getFirstDayOfMonth(year, month);

    const days: CalendarDay[] = [];

    // Add previous month's trailing days
    if (firstDayOfWeek > 0) {
      const prevMonthDays = getDaysInMonth(
        month === 0 ? year - 1 : year,
        month === 0 ? 11 : month - 1,
      );
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        days.push({
          date: new Date(
            month === 0 ? year - 1 : year,
            month === 0 ? 11 : month - 1,
            prevMonthDays - i,
          ),
          isCurrentMonth: false,
        });
      }
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Add next month's leading days to fill last week
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: new Date(
            month === 11 ? year + 1 : year,
            month === 11 ? 0 : month + 1,
            i,
          ),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [currentDate]);

  const getDayState = (day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      return 'disabled' as const;
    }
    if (isSameDay(day.date, selectedDate)) {
      return 'selected' as const;
    }
    if (isSameDay(day.date, today)) {
      return 'today' as const;
    }
    return 'default' as const;
  };

  const weeks = useMemo(() => {
    const result: CalendarDay[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      result.push(calendarDays.slice(i, i + 7));
    }
    return result;
  }, [calendarDays]);

  const renderWeekRow = (weekDays: CalendarDay[], weekIndex: number) => {
    return (
      <View key={weekIndex} style={styles.weekRow}>
        {weekDays.map(day => (
          <DayCell
            key={day.date.toISOString()}
            date={day.date}
            state={getDayState(day)}
            onPress={onDateSelect}
          />
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.container}>
      <CalendarHeader
        currentDate={currentDate}
        onMonthChange={onMonthChange}
      />
      <View style={[styles.weekdaysRow, {borderBottomColor: colors.border}]}>
        {WEEKDAYS.map(day => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, {color: colors.textSecondary}]}>
              {day}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.daysContainer}>
        {weeks.map((week, index) => renderWeekRow(week, index))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  weekdaysRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  daysContainer: {
    paddingTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
  },
});
