import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CalendarEvent, CATEGORY_COLORS, formatTime} from '../../../shared';

interface EventCardProps {
  event: CalendarEvent;
}

export const EventCard: React.FC<EventCardProps> = ({event}) => {
  const categoryColor = CATEGORY_COLORS[event.category];

  const formatTimeRange = () => {
    if (event.isAllDay) {
      return 'All day';
    }
    return `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.colorIndicator, {backgroundColor: categoryColor}]} />
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.time}>{formatTimeRange()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#888',
  },
});
