import React, {useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GradientBackground} from '../../shared/ui';
import {formatDateKey} from '../../shared';
import {useCalendarStore} from '../../shared/store';
import {useEventsByMonth} from '../../shared/api';
import {CalendarWidget} from '../../widgets/calendar';
import {EventList} from '../../widgets/home';
import {DdayWidget} from '../../widgets/dday';

export const MainPage: React.FC = () => {
  const {
    currentMonth,
    selectedDate,
    setSelectedDate,
    goToPrevMonth,
    goToNextMonth,
  } = useCalendarStore();

  const {data: events = {}} = useEventsByMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  const handleMonthChange = useCallback(
    (direction: 'prev' | 'next') => {
      if (direction === 'prev') {
        goToPrevMonth();
      } else {
        goToNextMonth();
      }
    },
    [goToPrevMonth, goToNextMonth],
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate],
  );

  const selectedDateEvents = events[formatDateKey(selectedDate)] || [];
  const selectedDateTitle = selectedDate.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.ddaySection}>
            <DdayWidget />
          </View>
          <CalendarWidget
            currentDate={currentMonth}
            selectedDate={selectedDate}
            events={events}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
          />
          <EventList
            events={selectedDateEvents}
            title={`${selectedDateTitle} 일정`}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  ddaySection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export default MainPage;
