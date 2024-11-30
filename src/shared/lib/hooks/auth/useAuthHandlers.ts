import { useApolloClient, useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';

import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import {
  LOGIN_WITH_GOOGLE_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_USER,
  SIGN_IN_WITH_EMAIL,
} from 'shared/query/apolloQueries';
import { type User } from 'shared/types';

interface LoginWithGoogleData {
  loginWithGoogle: {
    user: User | null;
    isFirstLogin: boolean;
  };
}

export interface SignUpWithEmailData {
  displayName: string;
  email: string;
  password: string;
  repeatPassword: string;
  recaptcha: string;
}

export interface SignInWithEmailData {
  email: string;
  password: string;
}

export const useAuthHandlers = () => {
  const client = useApolloClient();
  const [loginWithGoogle] = useMutation<LoginWithGoogleData>(LOGIN_WITH_GOOGLE_MUTATION);
  const [registerUser] = useMutation(REGISTER_USER);
  const [signInWithEmail] = useMutation(SIGN_IN_WITH_EMAIL);

  const { setIsLoading, setUser, setError, setAuthModalType, checkAuth } = useAuth();

  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await loginWithGoogle({
          variables: { code: tokenResponse.code },
        });
        if (data?.loginWithGoogle.user) {
          setUser(data.loginWithGoogle.user);
          if (data.loginWithGoogle.isFirstLogin) {
            setAuthModalType('SuccessfulSignUp');
          } else {
            setAuthModalType(null);
          }
          await client.resetStore();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError(new Error('Google Login Error'));
      setIsLoading(false);
    },
  });

  const signUpWithEmailHandler = async (data: SignUpWithEmailData) => {
    try {
      const response = await registerUser({
        variables: {
          email: data.email,
          displayName: data.displayName,
          password: data.password,
        },
      });
      if (response) {
        await checkAuth();
        setAuthModalType('SuccessfulSignUp');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign up'));
    }
  };

  const signInWithEmailHandler = async (data: SignInWithEmailData) => {
    try {
      const response = await signInWithEmail({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      if (response) {
        await checkAuth();
        await client.resetStore();
        setAuthModalType(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign in'));
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await client.mutate({ mutation: LOGOUT_MUTATION });
      setUser(null);
      await client.resetStore();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred during logout'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    continueWithGoogle,
    signInWithEmailHandler,
    signUpWithEmailHandler,
    logout,
    setAuthModalType,
  };
};
