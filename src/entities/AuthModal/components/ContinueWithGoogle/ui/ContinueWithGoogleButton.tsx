import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from 'shared/api';
import { client } from 'shared/config/apolloClient';
import { useLoginWithGoogleMutation } from 'shared/generated/graphql';
import { GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { mapLoginWithGoogleData } from '../../../mappers';

export const ContinueWithGoogleButton = () => {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const { setUser, setIsLoading, setError, setAuthModalContentVariant } = useAuth();
  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      //   setIsLoading(true);
      try {
        const { data } = await loginWithGoogle({ variables: { code: tokenResponse.code } });
        if (data?.loginWithGoogle) {
          const user = mapLoginWithGoogleData(data);
          if (user) {
            setUser(user);
            setIsLoading(false);
            if (data.loginWithGoogle.isFirstLogin) {
              setAuthModalContentVariant('SuccessfulSignUp');
            } else {
              setAuthModalContentVariant(null);
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

  return <GoogleLoginButton onClick={continueWithGoogle} />;
};
