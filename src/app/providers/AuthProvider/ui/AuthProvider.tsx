/* eslint-disable @typescript-eslint/no-misused-promises */

import { type FC, type PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { AuthContext } from 'shared/lib/reactContext/Auth/AuthContext';

import { useAuthHandlers } from '../lib/useAuthHandlers';

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    checkAuth,
    continueWithGoogle,
    signInWithEmailHandler,
    signUpWithEmailHandler,
    authPopupContent,
    setAuthPopupContent,
    logout,
    user,
    loading,
    error,
  } = useAuthHandlers();

  useEffect(() => {
    const controller = new AbortController();
    checkAuth();
    return () => {
      controller.abort();
    };
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        checkAuth,
        user,
        continueWithGoogle,
        signInWithEmailHandler,
        signUpWithEmailHandler,
        authPopupContent,
        setAuthPopupContent,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
