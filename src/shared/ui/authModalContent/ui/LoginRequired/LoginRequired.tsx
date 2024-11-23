import { GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './LoginRequired.module.scss';

interface LoginRequiredProps {
  onSwitchToSignIn: () => void;
  onSwitchToSignUp: () => void;
}

export const LoginRequired = ({ onSwitchToSignIn, onSwitchToSignUp }: LoginRequiredProps) => {
  return (
    <div className={cls.LoginRequired}>
      <h2>Login Required</h2>
      <p>You need to be logged in to perform this action.</p>
      <div className={cls.buttons}>
        <GoogleLoginButton textButton="Continue with Google" />
        <RegularButton onClick={onSwitchToSignIn}>Sign in</RegularButton>
      </div>
      <div className={cls.noAccount}>
        No account? <span onClick={onSwitchToSignUp}>Create one</span>
      </div>
    </div>
  );
};
