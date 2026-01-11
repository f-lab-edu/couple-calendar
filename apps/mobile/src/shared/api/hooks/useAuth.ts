import {useMutation} from '@tanstack/react-query';
import {useAuthStore} from '../../store';
import {mockUser, delay} from '../mockData';
import type {User} from '../../types';

interface AppleAuthCredential {
  identityToken: string;
  user: string;
  email?: string | null;
  fullName?: {
    givenName?: string | null;
    familyName?: string | null;
  } | null;
}

interface LoginResponse {
  user: User;
  token: string;
}

// Mock API Functions
const loginWithApple = async (
  credential: AppleAuthCredential,
): Promise<LoginResponse> => {
  await delay(500);

  // Simulate server validation and user creation/login
  const name =
    credential.fullName?.givenName || credential.email?.split('@')[0] || '사용자';

  const user: User = {
    ...mockUser,
    id: credential.user,
    email: credential.email || 'user@privaterelay.appleid.com',
    name,
  };

  return {
    user,
    token: `mock-token-${Date.now()}`,
  };
};

const logout = async (): Promise<void> => {
  await delay(200);
  // Simulate server logout
};

// Hooks
export const useAppleLogin = () => {
  const {login} = useAuthStore();

  return useMutation({
    mutationFn: loginWithApple,
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
};

export const useLogout = () => {
  const {logout: logoutStore} = useAuthStore();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logoutStore();
    },
  });
};
