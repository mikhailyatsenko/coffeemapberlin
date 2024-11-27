import './GoogleLoginButton.scss';
import { useAuthHandlers } from 'shared/lib/hooks/auth/useAuthHandlers';

interface GoogleLoginButtonProps {
  textButton?: string;
}

export const GoogleLoginButton = ({ textButton }: GoogleLoginButtonProps) => {
  const { continueWithGoogle } = useAuthHandlers();

  return (
    <button onClick={continueWithGoogle} type="button" className="login-with-google-btn">
      {textButton || 'Sign in'}
    </button>
  );
};
