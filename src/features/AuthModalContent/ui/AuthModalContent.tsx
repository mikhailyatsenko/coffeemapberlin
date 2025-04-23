import { SuccessfulSignUp, LoginRequired, SignInWithEmail, SignUpWithEmail } from 'entities/AuthForm';
import { type AuthContextType } from 'shared/context/Auth/AuthContext';
import cls from './AuthModalContent.module.scss';

interface AuthModalContentProps {
  currentContent: AuthContextType['authModalContentVariant'];
  setAuthModalContentVariant: AuthContextType['setAuthModalContentVariant'];
}

export const AuthModalContent: React.FC<AuthModalContentProps> = ({ currentContent, setAuthModalContentVariant }) => {
  const handleSwitchToSignUp = () => {
    setAuthModalContentVariant('SignUpWithEmail');
  };

  const handleSwitchToSignIn = () => {
    setAuthModalContentVariant('SignInWithEmail');
  };

  return (
    <div className={cls.authModalContent}>
      {currentContent === 'LoginRequired' && (
        <LoginRequired onSwitchToSignUp={handleSwitchToSignUp} onSwitchToSignIn={handleSwitchToSignIn} />
      )}
      {currentContent === 'SignUpWithEmail' && <SignUpWithEmail onSwitchToSignIn={handleSwitchToSignIn} />}
      {currentContent === 'SuccessfulSignUp' && <SuccessfulSignUp />}
      {currentContent === 'SignInWithEmail' && <SignInWithEmail onSwitchToSignUp={handleSwitchToSignUp} />}
    </div>
  );
};
