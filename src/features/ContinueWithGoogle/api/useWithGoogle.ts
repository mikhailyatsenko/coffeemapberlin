import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { client } from 'shared/config/apolloClient';
import { useLoginWithGoogleMutation } from 'shared/generated/graphql';
import { setUser } from 'shared/stores/auth';
import { hideModal, showSuccessfulSignUp } from 'shared/stores/modal';
import { revalidatePlaces } from 'shared/stores/places';
import { mapLoginWithGoogleData } from '../mappers';
import { type UseWithGoogleProps } from '../types';

export const useWithGoogle = ({ setError }: UseWithGoogleProps) => {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const [isLoading, setIsLoading] = useState(false);
  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        setError(null);
        const { data } = await loginWithGoogle({ variables: { code: tokenResponse.code } });
        if (data?.loginWithGoogle) {
          const user = mapLoginWithGoogleData(data);
          if (user) {
            await client.resetStore();
            revalidatePlaces();
            setUser(user);
            if (data.loginWithGoogle.isFirstLogin) {
              showSuccessfulSignUp();
            } else {
              hideModal();
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError(new Error('Google Login Error'));
    },
  });

  return { continueWithGoogle, isLoading };
};
