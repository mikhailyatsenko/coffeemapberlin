import { GOOGLE_LOGIN_BUTTON_TEXT } from '../constants';
import { type GoogleLoginButtonProps } from '../types';
import './GoogleLoginButton.scss';

export const GoogleLoginButton = ({ textButton = GOOGLE_LOGIN_BUTTON_TEXT, onClick }: GoogleLoginButtonProps) => {
  return (
    <button onClick={onClick} type="button" className="login-with-google-btn">
      {textButton || 'Sign in'}
    </button>
  );
};
