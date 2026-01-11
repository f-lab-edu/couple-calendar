// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  category: 'DATE' | 'INDIVIDUAL' | 'ANNIVERSARY' | 'OTHER';
  memo?: string;
  createdBy?: string;
}

export type DayCellState = 'default' | 'today' | 'selected' | 'disabled';

export interface EventMap {
  [dateKey: string]: CalendarEvent[];
}

export const CATEGORY_COLORS: Record<CalendarEvent['category'], string> = {
  DATE: '#FF8B94',
  INDIVIDUAL: '#7EC8E3',
  ANNIVERSARY: '#FF6B6B',
  OTHER: '#A8A8A8',
};

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  createdAt: Date;
}

// Couple Types
export interface Couple {
  id: string;
  user1Id: string;
  user2Id: string;
  startDate: Date;
  createdAt: Date;
}

export interface Partner {
  id: string;
  name: string;
  profileImage?: string;
}

// Anniversary Types
export interface Anniversary {
  id: string;
  title: string;
  date: Date;
  isRecurring: boolean;
  coupleId: string;
}
