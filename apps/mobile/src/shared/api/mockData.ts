import type {CalendarEvent, User, Couple, Partner, Anniversary} from '../types';
import {formatDateKey} from '../lib/date';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  email: 'user@example.com',
  name: '나',
  profileImage: undefined,
  createdAt: new Date('2024-01-01'),
};

// Mock Partner
export const mockPartner: Partner = {
  id: 'user-2',
  name: '파트너',
  profileImage: undefined,
};

// Mock Couple
export const mockCouple: Couple = {
  id: 'couple-1',
  user1Id: 'user-1',
  user2Id: 'user-2',
  startDate: new Date('2024-01-15'),
  createdAt: new Date('2024-01-20'),
};

// Mock Events
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

export const mockEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: '데이트',
    startTime: new Date(year, month, 15, 18, 0),
    endTime: new Date(year, month, 15, 22, 0),
    isAllDay: false,
    category: 'DATE',
    memo: '저녁 식사 예약',
    createdBy: 'user-1',
  },
  {
    id: 'event-2',
    title: '100일 기념일',
    startTime: new Date(year, month, 20, 0, 0),
    endTime: new Date(year, month, 20, 23, 59),
    isAllDay: true,
    category: 'ANNIVERSARY',
    createdBy: 'user-1',
  },
  {
    id: 'event-3',
    title: '파트너 병원',
    startTime: new Date(year, month, 22, 14, 0),
    endTime: new Date(year, month, 22, 16, 0),
    isAllDay: false,
    category: 'INDIVIDUAL',
    memo: '정기 검진',
    createdBy: 'user-2',
  },
  {
    id: 'event-4',
    title: '영화 보기',
    startTime: new Date(year, month, today.getDate(), 19, 0),
    endTime: new Date(year, month, today.getDate(), 22, 0),
    isAllDay: false,
    category: 'DATE',
    createdBy: 'user-1',
  },
  {
    id: 'event-5',
    title: '생일 파티',
    startTime: new Date(year, month, 28, 18, 0),
    endTime: new Date(year, month, 28, 23, 0),
    isAllDay: false,
    category: 'OTHER',
    memo: '친구 생일',
    createdBy: 'user-1',
  },
];

// Mock Anniversaries
export const mockAnniversaries: Anniversary[] = [
  {
    id: 'ann-1',
    title: '만난 날',
    date: new Date('2024-01-15'),
    isRecurring: true,
    coupleId: 'couple-1',
  },
  {
    id: 'ann-2',
    title: '첫 키스',
    date: new Date('2024-02-14'),
    isRecurring: true,
    coupleId: 'couple-1',
  },
];

// Helper to convert events array to EventMap
export const getEventMap = (events: CalendarEvent[]) => {
  const eventMap: Record<string, CalendarEvent[]> = {};

  events.forEach((event) => {
    const dateKey = formatDateKey(event.startTime);
    if (!eventMap[dateKey]) {
      eventMap[dateKey] = [];
    }
    eventMap[dateKey].push(event);
  });

  return eventMap;
};

// Simulated API delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
