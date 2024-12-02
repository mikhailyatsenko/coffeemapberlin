import { useState } from 'react';
import { SuccessfulSignUp, LoginRequired, SignInWithEmail, SignUpWithEmail } from 'entities/AuthForm';
import { type AuthModalContentProps } from 'shared/lib/reactContext/Auth/AuthContext';
import cls from './AuthModal.module.scss';

export const AuthModal: React.FC<AuthModalContentProps> = ({ initialContent }) => {
  const [currentContent, setCurrentContent] = useState(initialContent);

  const handleSwitchToSignUp = () => {
    setCurrentContent('SignUpWithEmail');
  };

  const handleSwitchToSignIn = () => {
    setCurrentContent('SignInWithEmail');
  };

  const handleSuccessfulSignUp = () => {
    setCurrentContent('SuccessfulSignUp');
  };

  return (
    <div className={cls.authModalContent}>
      {currentContent === 'LoginRequired' && (
        <LoginRequired onSwitchToSignUp={handleSwitchToSignUp} onSwitchToSignIn={handleSwitchToSignIn} />
      )}
      {currentContent === 'SignUpWithEmail' && (
        <SignUpWithEmail onSwitchToSignIn={handleSwitchToSignIn} onSuccessfulSignUp={handleSuccessfulSignUp} />
      )}
      {currentContent === 'SuccessfulSignUp' && <SuccessfulSignUp />}
      {currentContent === 'SignInWithEmail' && <SignInWithEmail onSwitchToSignUp={handleSwitchToSignUp} />}
    </div>
  );
};
