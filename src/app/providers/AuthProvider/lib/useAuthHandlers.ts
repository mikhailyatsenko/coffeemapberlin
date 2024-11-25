/* eslint-disable @typescript-eslint/no-misused-promises */

import { useApolloClient, useMutation } from '@apollo/client';
import { useGoogleLogin } from '@react-oauth/google';
import { useCallback, useState } from 'react';
import { type SignInWithEmailData, type SignUpWithEmailData } from 'shared/lib/reactContext/Auth/AuthContext';
import {
  CURRENT_USER_QUERY,
  LOGIN_WITH_GOOGLE_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_USER,
  SIGN_IN_WITH_EMAIL,
} from 'shared/query/apolloQueries';
import { type User } from 'shared/types';
import { type AuthModalContentProps } from 'shared/ui/authModalContent/ui/AuthModalContent';

interface CurrentUserData {
  currentUser: User | null;
}

interface LoginWithGoogleData {
  loginWithGoogle: {
    user: User | null;
    isFirstLogin: boolean;
  };
}

export const useAuthHandlers = () => {
  const client = useApolloClient();
  const [loginWithGoogle] = useMutation<LoginWithGoogleData>(LOGIN_WITH_GOOGLE_MUTATION);
  const [registerUser, { error: signUpError }] = useMutation(REGISTER_USER);
  const [signInWithEmail, { error: signInError }] = useMutation(SIGN_IN_WITH_EMAIL);
  const [error, setError] = useState<Error | null>(null);
  const [authPopupContent, setAuthPopupContent] = useState<AuthModalContentProps['initialContent'] | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await client.query<CurrentUserData>({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only',
      });

      setUser(data.currentUser);
    } catch (error) {
      console.log('Error checking authentication:', error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [client]);

  const continueWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const { data } = await loginWithGoogle({
          variables: { code: tokenResponse.code },
        });
        if (data?.loginWithGoogle.user) {
          setUser(data.loginWithGoogle.user);
          if (data.loginWithGoogle.isFirstLogin) {
            setAuthPopupContent('SuccessfulSignUp');
          } else {
            setAuthPopupContent(null);
          }
          await client.resetStore();
        }
      } catch (err) {
        console.error('Error logging in with Google:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred during login'));
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google Login Error:', error);
      setError(new Error('Google Login Error'));
      setLoading(false);
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
        checkAuth();
        setAuthPopupContent('SuccessfulSignUp');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';

      console.error('Registration error:', errorMessage);
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
        checkAuth();
        setAuthPopupContent(null);
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';
      console.warn('Login error:', errorMessage);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.mutate({ mutation: LOGOUT_MUTATION });
      console.log(data?.logout.message);
      setUser(null);
      await client.resetStore();
      console.log('Apollo Client cache reset');
    } catch (error) {
      console.error('Error logging out:', error);
      setError(error instanceof Error ? error : new Error('An unknown error occurred during logout'));
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAuth,
    user,
    continueWithGoogle,
    signInWithEmailHandler,
    signUpWithEmailHandler,
    logout,
    loading,
    error,
    authPopupContent,
    setAuthPopupContent,
  };
};

// error, loading check
