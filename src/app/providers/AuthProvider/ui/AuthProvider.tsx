/* eslint-disable @typescript-eslint/no-misused-promises */

import { useApolloClient } from '@apollo/client';
import { useCallback, useState, type FC, type PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AuthContext } from 'shared/lib/reactContext/Auth/AuthContext';
import { CURRENT_USER_QUERY } from 'shared/query/apolloQueries';
import { type User } from 'shared/types';
import { type AuthModalContentProps } from 'shared/ui/authModalContent/ui/AuthModalContent';

interface CurrentUserData {
  currentUser: User | null;
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useApolloClient();
  const [error, setError] = useState<Error | null>(null);

  const [authModalType, setAuthModalType] = useState<AuthModalContentProps['initialContent'] | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await client.query<CurrentUserData>({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only',
      });

      setUser(data.currentUser);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [client, setError, setIsLoading, setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        checkAuth,
        user,
        setUser,
        authModalType,
        setAuthModalType,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
