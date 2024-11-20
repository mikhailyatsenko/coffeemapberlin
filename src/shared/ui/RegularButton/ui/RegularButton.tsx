import { type PropsWithChildren } from 'react';
import cls from './RegularButton.module.scss';

interface RegularButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  type?: 'submit' | 'reset' | 'button' | undefined;
  disabled?: boolean;
  theme?: 'blank' | 'error' | 'success';
}

export const RegularButton = ({ type, disabled, theme, className = '', children, onClick }: RegularButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={`${cls.RegularButton} ${className} ${theme ? cls[theme] : ''}`}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
