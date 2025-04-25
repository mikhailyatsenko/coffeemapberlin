/* eslint-disable @typescript-eslint/no-misused-promises */

import { useApolloClient } from '@apollo/client';
import { useCallback, useState, type FC, type PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AuthContext } from 'shared/context/Auth/AuthContext';
import { CurrentUserDocument } from 'shared/generated/graphql';
import { type User } from 'shared/types';
interface CurrentUserData {
  currentUser: User | null;
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useApolloClient();
  const [error, setError] = useState<Error | null>(null);

  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await client.query<CurrentUserData>({
        query: CurrentUserDocument,
        fetchPolicy: 'network-only',
      });

      setUser(data.currentUser);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('An unknown error occurred'));
    }
  }, [client, setError, setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        checkAuth,
        user,
        setUser,
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
