import { useWithGoogle } from 'features/ContinueWithGoogle';
import { GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { RegularButton } from 'shared/ui/RegularButton';
import { type LoginRequiredProps } from '../types';
import cls from './LoginRequired.module.scss';

export const LoginRequired = ({ onSwitchToSignIn, onSwitchToSignUp, setError }: LoginRequiredProps) => {
  const continueWithGoogle = useWithGoogle({ setError });

  return (
    <div className={cls.LoginRequired}>
      <h2>Login Required</h2>
      <p>You need to be logged in to perform this action.</p>
      <div className={cls.buttons}>
        <GoogleLoginButton onClick={continueWithGoogle} />
        <RegularButton onClick={onSwitchToSignIn}>Sign in</RegularButton>
      </div>
      <div className={cls.noAccount}>
        No account? <span onClick={onSwitchToSignUp}>Create one</span>
      </div>
    </div>
  );
};
