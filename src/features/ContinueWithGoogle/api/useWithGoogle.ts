import { useGoogleLogin } from '@react-oauth/google';
import { client } from 'shared/config/apolloClient';
import { useLoginWithGoogleMutation } from 'shared/generated/graphql';
import { setUser } from 'shared/stores/auth';
import { hideModal, showSuccessfulSignUp } from 'shared/stores/modal';
import { revalidatePlaces } from 'shared/stores/places';
import { mapLoginWithGoogleData } from '../mappers';
import { type UseWithGoogleProps } from '../types';

export const useWithGoogle = ({ setError }: UseWithGoogleProps) => {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
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
            revalidatePlaces();
            setUser(user);
            if (data.loginWithGoogle.isFirstLogin) {
              showSuccessfulSignUp();
            } else {
              hideModal();
            }
            // First reset places, then Apollo Client will update the cache
            // Reset Apollo Client cache after revalidation
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
