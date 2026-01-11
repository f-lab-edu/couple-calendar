import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Card} from '../../../shared/ui';
import {
  EventMap,
  WEEKDAYS,
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  formatDateKey,
} from '../../../shared';
import {DayCell} from '../../../entities/calendar';
import {CalendarHeader} from './CalendarHeader';

interface CalendarWidgetProps {
  currentDate: Date;
  selectedDate: Date;
  events: EventMap;
  onMonthChange: (direction: 'prev' | 'next') => void;
  onDateSelect: (date: Date) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  currentDate,
  selectedDate,
  events,
  onMonthChange,
  onDateSelect,
}) => {
  const today = new Date();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfWeek = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentDate]);

  const getDayState = (date: Date) => {
    if (isSameDay(date, selectedDate)) {
      return 'selected';
    }
    if (isSameDay(date, today)) {
      return 'today';
    }
    return 'default';
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] || [];
  };

  const renderWeekRow = (weekDays: (Date | null)[], weekIndex: number) => {
    return (
      <View key={weekIndex} style={styles.weekRow}>
        {weekDays.map((date, dayIndex) => {
          if (!date) {
            return <View key={`empty-${dayIndex}`} style={styles.emptyCell} />;
          }
          return (
            <DayCell
              key={date.toISOString()}
              date={date}
              state={getDayState(date)}
              events={getEventsForDate(date)}
              onPress={onDateSelect}
            />
          );
        })}
      </View>
    );
  };

  const weeks = useMemo(() => {
    const result: (Date | null)[][] = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      const week = calendarDays.slice(i, i + 7);
      while (week.length < 7) {
        week.push(null);
      }
      result.push(week);
    }
    return result;
  }, [calendarDays]);

  return (
    <Card style={styles.container}>
      <CalendarHeader
        currentDate={currentDate}
        onMonthChange={onMonthChange}
      />
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map(day => (
          <View key={day} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
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
    borderBottomColor: '#F0F0F0',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  daysContainer: {
    paddingTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
  },
  emptyCell: {
    flex: 1,
    minHeight: 44,
  },
});
