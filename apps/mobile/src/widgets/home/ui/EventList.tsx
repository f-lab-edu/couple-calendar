import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {CalendarEvent} from '../../../shared';
import {EventCard} from './EventCard';

interface EventListProps {
  events: CalendarEvent[];
  title?: string;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  title = "Today's Events",
}) => {
  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events scheduled</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
    color: '#333',
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
    color: '#888',
  },
});
