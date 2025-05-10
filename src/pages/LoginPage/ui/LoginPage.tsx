import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWithGoogle } from 'features/ContinueWithGoogle';
import { SignInWithEmail } from 'features/SignInWithEmail';
import { SignUpWithEmail } from 'features/SignUpWithEmail';
import { useAuth } from 'shared/api';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';

import { GOOGLE_LOGIN_BUTTON_KEY, GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import cls from './LoginPage.module.scss';

export const LoginPage = () => {
  const { user } = useAuth();
  const { showSuccessfulSignUp } = useAuthModal();
  const continueWithGoogle = useWithGoogle();
  const navigate = useNavigate();
  const location = useLocation();

  const from: string = location.state?.from?.pathname || '/';

  const [isSignIn, setIiSignIn] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  return (
    <div className={cls.LoginPage}>
      <div className={cls.loginFormWrapper}>
        {isSignIn ? (
          <SignInWithEmail
            onSwitchToSignUp={() => {
              setIiSignIn(false);
            }}
            continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
          />
        ) : (
          <SignUpWithEmail
            onSuccessfulSignUp={showSuccessfulSignUp}
            onSwitchToSignIn={() => {
              setIiSignIn(true);
            }}
            continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
          />
        )}
      </div>
    </div>
  );
};
