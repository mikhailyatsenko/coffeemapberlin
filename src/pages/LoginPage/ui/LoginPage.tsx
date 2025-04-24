import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignInWithEmail, SignUpWithEmail } from 'entities/AuthModal';
import { useAuth } from 'shared/api';
import cls from './LoginPage.module.scss';

export const LoginPage = () => {
  const { user } = useAuth();
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
          />
        ) : (
          <SignUpWithEmail
            onSwitchToSignIn={() => {
              setIiSignIn(true);
            }}
          />
        )}
      </div>
    </div>
  );
};
