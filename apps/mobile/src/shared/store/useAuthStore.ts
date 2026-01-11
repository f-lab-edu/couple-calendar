import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User} from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoading: true,
      setUser: (user) => set({user, isLoggedIn: !!user}),
      setToken: (token) => set({token}),
      login: (user, token) => set({user, token, isLoggedIn: true}),
      logout: () => set({user: null, token: null, isLoggedIn: false}),
      setLoading: (isLoading) => set({isLoading}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    },
  ),
);
