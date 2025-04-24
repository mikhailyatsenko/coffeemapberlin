import { createContext } from 'react';
import { type User } from 'shared/types';

export interface AuthContextType {
  isLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  checkAuth: () => Promise<void>;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
