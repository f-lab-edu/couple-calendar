import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../queryClient';
import {mockAnniversaries, delay} from '../mockData';
import type {Anniversary} from '../../types';

// In-memory store
let anniversariesStore = [...mockAnniversaries];

// Helper to calculate days until anniversary
export const getDaysUntil = (date: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  // Set to this year
  targetDate.setFullYear(today.getFullYear());
  targetDate.setHours(0, 0, 0, 0);

  // If the date has passed this year, set to next year
  if (targetDate < today) {
    targetDate.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper to calculate days since start date (D-Day count)
export const getDaysSince = (startDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to count the first day
};

// Mock API Functions
const fetchAnniversaries = async (): Promise<Anniversary[]> => {
  await delay(300);
  return anniversariesStore;
};

const fetchUpcomingAnniversaries = async (
  count: number,
): Promise<Anniversary[]> => {
  await delay(300);
  return anniversariesStore
    .map((ann) => ({...ann, daysUntil: getDaysUntil(ann.date)}))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, count);
};

const createAnniversary = async (
  anniversary: Omit<Anniversary, 'id'>,
): Promise<Anniversary> => {
  await delay(300);
  const newAnniversary: Anniversary = {
    ...anniversary,
    id: `ann-${Date.now()}`,
  };
  anniversariesStore.push(newAnniversary);
  return newAnniversary;
};

const deleteAnniversary = async (id: string): Promise<void> => {
  await delay(300);
  anniversariesStore = anniversariesStore.filter((a) => a.id !== id);
};

// Hooks
export const useAnniversaries = () => {
  return useQuery({
    queryKey: queryKeys.anniversaries.all,
    queryFn: fetchAnniversaries,
  });
};

export const useUpcomingAnniversaries = (count: number = 5) => {
  return useQuery({
    queryKey: queryKeys.anniversaries.upcoming(count),
    queryFn: () => fetchUpcomingAnniversaries(count),
  });
};

export const useCreateAnniversary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnniversary,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.anniversaries.all});
    },
  });
};

export const useDeleteAnniversary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnniversary,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: queryKeys.anniversaries.all});
    },
  });
};
