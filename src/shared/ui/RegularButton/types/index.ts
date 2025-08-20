import { type PropsWithChildren, type ButtonHTMLAttributes, type ReactNode } from 'react';
export type ButtonTheme = 'primary' | 'success' | 'error' | 'neutral';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface RegularButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: 'submit' | 'reset' | 'button';
  className?: string;
}
