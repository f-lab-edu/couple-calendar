import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../queryClient';
import {mockEvents, getEventMap, delay} from '../mockData';
import type {CalendarEvent, EventMap} from '../../types';
import {formatDateKey} from '../../lib/date';

// In-memory store for mock data
let eventsStore = [...mockEvents];

// API Functions (Mock)
const fetchEvents = async (): Promise<CalendarEvent[]> => {
  await delay(300);
  return eventsStore;
};

const fetchEventsByMonth = async (
  year: number,
  month: number,
): Promise<EventMap> => {
  await delay(300);
  const filtered = eventsStore.filter((event) => {
    const eventDate = new Date(event.startTime);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
  return getEventMap(filtered);
};

const fetchEventsByDate = async (dateKey: string): Promise<CalendarEvent[]> => {
  await delay(200);
  return eventsStore.filter(
    (event) => formatDateKey(new Date(event.startTime)) === dateKey,
  );
};

const createEvent = async (
  event: Omit<CalendarEvent, 'id'>,
): Promise<CalendarEvent> => {
  await delay(300);
  const newEvent: CalendarEvent = {
    ...event,
    id: `event-${Date.now()}`,
  };
  eventsStore.push(newEvent);
  return newEvent;
};

const updateEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
  await delay(300);
  const index = eventsStore.findIndex((e) => e.id === event.id);
  if (index === -1) {
    throw new Error('Event not found');
  }
  eventsStore[index] = event;
  return event;
};

const deleteEvent = async (id: string): Promise<void> => {
  await delay(300);
  eventsStore = eventsStore.filter((e) => e.id !== id);
};

// Hooks
export const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events.all,
    queryFn: fetchEvents,
  });
};

export const useEventsByMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: queryKeys.events.byMonth(year, month),
    queryFn: () => fetchEventsByMonth(year, month),
  });
};

export const useEventsByDate = (dateKey: string) => {
  return useQuery({
    queryKey: queryKeys.events.byDate(dateKey),
    queryFn: () => fetchEventsByDate(dateKey),
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.events.all});
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEvent,
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries({queryKey: queryKeys.events.all});
      queryClient.invalidateQueries({
        queryKey: queryKeys.events.detail(updatedEvent.id),
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.events.all});
    },
  });
};
