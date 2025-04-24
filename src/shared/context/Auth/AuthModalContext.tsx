import { createContext, useContext, useState, type ReactNode } from 'react';
import { AuthModalContentVariant } from 'entities/AuthModal/constants';

interface AuthModalContextType {
  authModalContentVariant: AuthModalContentVariant;
  // setAuthModalContentVariant: (variant: AuthModalContentVariant) => void;
  showSuccessfulSignUp: () => void;
  showLoginRequired: () => void;
  showSignIn: () => void;
  showSignUp: () => void;
  hideModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [authModalContentVariant, setAuthModalContentVariant] = useState<AuthModalContentVariant>(
    AuthModalContentVariant.Hidden,
  );

  const showLoginRequired = () => {
    setAuthModalContentVariant(AuthModalContentVariant.LoginRequired);
  };

  const showSignIn = () => {
    setAuthModalContentVariant(AuthModalContentVariant.SignInWithEmail);
  };

  const showSignUp = () => {
    setAuthModalContentVariant(AuthModalContentVariant.SignUpWithEmail);
  };

  const hideModal = () => {
    setAuthModalContentVariant(AuthModalContentVariant.Hidden);
  };

  const showSuccessfulSignUp = () => {
    setAuthModalContentVariant(AuthModalContentVariant.SuccessfulSignUp);
  };

  return (
    <AuthModalContext.Provider
      value={{
        authModalContentVariant,
        showSuccessfulSignUp,
        showLoginRequired,
        showSignIn,
        showSignUp,
        hideModal,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};
