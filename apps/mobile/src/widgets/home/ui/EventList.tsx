import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {CalendarEvent, useAppTheme} from '../../../shared';
import {EventCard} from './EventCard';

interface EventListProps {
  events: CalendarEvent[];
}

export const EventList: React.FC<EventListProps> = ({events}) => {
  const {colors} = useAppTheme();

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, {color: colors.text}]}>
          Today's Events
        </Text>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            No events scheduled
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>Today's Events</Text>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});
