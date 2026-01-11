import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {queryKeys} from '../queryClient';
import {useCoupleStore} from '../../store';
import {mockCouple, mockPartner, delay} from '../mockData';
import type {Couple, Partner} from '../../types';

// Mock API Functions
const generateInviteCode = async (): Promise<string> => {
  await delay(300);
  // Generate 6-character alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const validateInviteCode = async (
  code: string,
): Promise<{couple: Couple; partner: Partner}> => {
  await delay(500);

  // Simulate validation (in real app, this would verify the code with backend)
  if (code.length !== 6) {
    throw new Error('Invalid code format');
  }

  // For mock, always return success
  return {
    couple: mockCouple,
    partner: mockPartner,
  };
};

const fetchCurrentCouple = async (): Promise<Couple | null> => {
  await delay(300);
  // Return mock couple (in real app, check if user is in a couple)
  return null; // Start with no couple for testing flow
};

const fetchPartner = async (): Promise<Partner | null> => {
  await delay(300);
  return null;
};

const disconnectCouple = async (): Promise<void> => {
  await delay(300);
  // Simulate disconnection
};

// Hooks
export const useCurrentCouple = () => {
  return useQuery({
    queryKey: queryKeys.couple.current,
    queryFn: fetchCurrentCouple,
  });
};

export const usePartner = () => {
  return useQuery({
    queryKey: queryKeys.couple.partner,
    queryFn: fetchPartner,
  });
};

export const useGenerateInviteCode = () => {
  const {setConnectionCode} = useCoupleStore();

  return useMutation({
    mutationFn: generateInviteCode,
    onSuccess: (code) => {
      setConnectionCode(code);
    },
  });
};

export const useConnectWithCode = () => {
  const queryClient = useQueryClient();
  const {connect} = useCoupleStore();

  return useMutation({
    mutationFn: validateInviteCode,
    onSuccess: (data) => {
      connect(data.couple, data.partner);
      queryClient.invalidateQueries({queryKey: queryKeys.couple.current});
      queryClient.invalidateQueries({queryKey: queryKeys.couple.partner});
    },
  });
};

export const useDisconnectCouple = () => {
  const queryClient = useQueryClient();
  const {disconnect} = useCoupleStore();

  return useMutation({
    mutationFn: disconnectCouple,
    onSuccess: () => {
      disconnect();
      queryClient.invalidateQueries({queryKey: queryKeys.couple.current});
      queryClient.invalidateQueries({queryKey: queryKeys.couple.partner});
    },
  });
};
