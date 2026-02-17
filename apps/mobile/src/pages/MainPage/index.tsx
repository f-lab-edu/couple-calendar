import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {GradientBackground} from '../../shared/ui';
import {formatDateKey, useAppTheme} from '../../shared';
import {useCalendarStore} from '../../shared/store';
import {useEventsByMonth} from '../../shared/api';
import {CalendarWidget} from '../../widgets/calendar';
import {EventList} from '../../widgets/home';
import type {MainStackParamList} from '../../app/navigation/BottomTabNavigator';

export const MainPage: React.FC = () => {
  const {colors} = useAppTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

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

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, {color: colors.text}]}>
              Shared Calendar
            </Text>
          </View>
          <CalendarWidget
            currentDate={currentMonth}
            selectedDate={selectedDate}
            events={events}
            onMonthChange={handleMonthChange}
            onDateSelect={handleDateSelect}
          />
          <EventList events={selectedDateEvents} />
          <TouchableOpacity
            style={styles.addEventButton}
            onPress={() => navigation.navigate('AddEvent')}>
            <Text style={[styles.addEventText, {color: colors.accent}]}>
              + Add Event
            </Text>
          </TouchableOpacity>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addEventButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addEventText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MainPage;
