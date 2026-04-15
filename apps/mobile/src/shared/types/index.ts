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
export type AnniversaryType = 'CUSTOM' | 'AUTO';

/**
 * 백엔드 `AnniversaryResponse`와 1:1 매핑.
 * - date는 ISO 8601 (YYYY-MM-DD) 문자열
 * - id는 CUSTOM의 경우 UUID, AUTO의 경우 `auto-day-{N}` 또는 `auto-year-{N}`
 * - description은 AUTO에서 항상 null
 * - daysUntil은 서버에서 계산된 오늘 기준 남은 일수 (음수면 지난 날)
 */
export interface Anniversary {
  id: string;
  coupleId: string;
  title: string;
  date: string;
  isRecurring: boolean;
  description: string | null;
  type: AnniversaryType;
  daysUntil: number;
}

export interface CreateAnniversaryRequest {
  title: string;
  date: string;
  isRecurring: boolean;
  description?: string;
}

export interface UpdateAnniversaryRequest {
  title?: string;
  date?: string;
  isRecurring?: boolean;
  description?: string;
}
