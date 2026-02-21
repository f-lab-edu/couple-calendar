import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {zustandMMKVStorage} from '../lib/storage';
import type {Couple, Partner} from '../types';

interface CoupleState {
  couple: Couple | null;
  partner: Partner | null;
  connectionCode: string | null;
  isConnected: boolean;
  setCouple: (couple: Couple | null) => void;
  setPartner: (partner: Partner | null) => void;
  setConnectionCode: (code: string | null) => void;
  connect: (couple: Couple, partner: Partner) => void;
  disconnect: () => void;
}

export const useCoupleStore = create<CoupleState>()(
  persist(
    (set) => ({
      couple: null,
      partner: null,
      connectionCode: null,
      isConnected: false,
      setCouple: (couple) => set({couple, isConnected: !!couple}),
      setPartner: (partner) => set({partner}),
      setConnectionCode: (connectionCode) => set({connectionCode}),
      connect: (couple, partner) =>
        set({couple, partner, isConnected: true, connectionCode: null}),
      disconnect: () =>
        set({couple: null, partner: null, isConnected: false}),
    }),
    {
      name: 'couple-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        couple: state.couple,
        partner: state.partner,
        isConnected: state.isConnected,
      }),
    },
  ),
);
