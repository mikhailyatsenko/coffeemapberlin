import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from 'shared/api';
import { client } from 'shared/config/apolloClient';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';
import { useLoginWithGoogleMutation } from 'shared/generated/graphql';
import { mapLoginWithGoogleData } from '../mappers';

export const useWithGoogle = () => {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const { setUser, setIsLoading, setError } = useAuth();
  const { showSuccessfulSignUp, hideModal } = useAuthModal();
  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await loginWithGoogle({ variables: { code: tokenResponse.code } });
        if (data?.loginWithGoogle) {
          const user = mapLoginWithGoogleData(data);
          if (user) {
            setUser(user);
            setIsLoading(false);
            if (data.loginWithGoogle.isFirstLogin) {
              showSuccessfulSignUp();
            } else {
              hideModal();
            }
            await client.resetStore();
          }
        }
      } catch (err) {
        setIsLoading(false);
        setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      }
    },
    onError: () => {
      setError(new Error('Google Login Error'));
      setIsLoading(false);
    },
  });

  return continueWithGoogle;
};
