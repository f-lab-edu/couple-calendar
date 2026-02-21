import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import appleAuth from '@invertase/react-native-apple-authentication';
import { useAppleLogin } from '../../../shared/api';

interface UseAppleAuthResult {
  signIn: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAppleAuth = (): UseAppleAuthResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: login } = useAppleLogin();

  const signIn = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      setError('Apple Sign-in is only available on iOS');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Perform Apple Sign-In request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });

      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // Check if authorized
      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { identityToken, user, email, fullName } = appleAuthRequestResponse;

        if (!identityToken) {
          throw new Error('No identity token received');
        }

        // Login with our backend
        await login({
          identityToken,
          user,
          email,
          fullName,
        });
      } else {
        throw new Error('Apple Sign-in authorization failed');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Apple Sign-in failed';

      // Don't show error for user cancellation
      if (errorMessage.includes('canceled') || errorMessage.includes('1001')) {
        setError(null);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [login]);

  return { signIn, isLoading, error };
};
