import { createContext } from 'react';
import { type User } from 'shared/types';
import { type AuthModalContentProps } from 'shared/ui/authModalContent/ui/AuthModalContent';

interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAuthPopupContent: React.Dispatch<
    React.SetStateAction<'LoginRequired' | 'SignUpWithEmail' | 'SignInWithEmail' | 'SuccessfulSignUp' | null>
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authPopupContent: AuthModalContentProps['initialContent'] | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  checkAuth: () => Promise<void>;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
