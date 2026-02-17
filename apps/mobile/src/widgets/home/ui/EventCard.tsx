import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CalendarEvent, formatTime, useAppTheme} from '../../../shared';

interface EventCardProps {
  event: CalendarEvent;
}

export const EventCard: React.FC<EventCardProps> = ({event}) => {
  const {isDark, colors} = useAppTheme();

  const formatTimeRange = () => {
    if (event.isAllDay) {
      return 'All day';
    }
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: colors.eventCardBg},
        isDark && styles.containerDark,
      ]}>
      <Text style={[styles.title, {color: colors.text}]}>{event.title}</Text>
      <Text style={[styles.time, {color: colors.textSecondary}]}>
        {formatTimeRange()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  containerDark: {
    shadowOpacity: 0,
    elevation: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  time: {
    fontSize: 13,
    marginLeft: 12,
  },
});
