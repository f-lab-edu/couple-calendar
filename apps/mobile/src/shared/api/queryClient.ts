import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const queryKeys = {
  events: {
    all: ['events'] as const,
    byMonth: (year: number, month: number) =>
      ['events', 'month', year, month] as const,
    byDate: (dateKey: string) => ['events', 'date', dateKey] as const,
    detail: (id: string) => ['events', 'detail', id] as const,
  },
  anniversaries: {
    all: ['anniversaries'] as const,
    upcoming: (count: number) => ['anniversaries', 'upcoming', count] as const,
  },
  couple: {
    current: ['couple', 'current'] as const,
    partner: ['couple', 'partner'] as const,
  },
  user: {
    current: ['user', 'current'] as const,
  },
};
