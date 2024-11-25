import { createContext } from 'react';
import { type User } from 'shared/types';
import { type AuthModalContentProps } from 'shared/ui/authModalContent/ui/AuthModalContent';

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

interface AuthContextType {
  loading: boolean;
  user: User | null;
  continueWithGoogle: () => void;
  signInWithEmailHandler: (data: SignInWithEmailData) => Promise<void>;
  signUpWithEmailHandler: (data: SignUpWithEmailData) => Promise<void>;
  checkAuth: () => void;
  authPopupContent: AuthModalContentProps['initialContent'] | null;
  setAuthPopupContent: React.Dispatch<React.SetStateAction<AuthModalContentProps['initialContent'] | null>>;
  logout: () => Promise<void>;

  error: Error | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
