import { useGoogleLogin } from '@react-oauth/google';
import { client } from 'shared/config/apolloClient';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';
import { useLoginWithGoogleMutation } from 'shared/generated/graphql';
import { setUser } from 'shared/stores/auth';
import { mapLoginWithGoogleData } from '../mappers';
import { type UseWithGoogleProps } from '../types';

export const useWithGoogle = ({ setError }: UseWithGoogleProps) => {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const { showSuccessfulSignUp, hideModal } = useAuthModal();
  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      try {
        setError(null);
        const { data } = await loginWithGoogle({ variables: { code: tokenResponse.code } });
        if (data?.loginWithGoogle) {
          const user = mapLoginWithGoogleData(data);
          if (user) {
            setUser(user);
            if (data.loginWithGoogle.isFirstLogin) {
              showSuccessfulSignUp();
            } else {
              hideModal();
            }
            await client.resetStore();
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      }
    },
    onError: () => {
      setError(new Error('Google Login Error'));
    },
  });

  return continueWithGoogle;
};
