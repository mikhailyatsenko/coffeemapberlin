import { clsx } from 'clsx';
import React from 'react';
import type { ButtonProps } from '../types';

/**
 * Button компонент с поддержкой tree shaking
 *
 * ✅ Правильные практики:
 * - Именованный экспорт
 * - Импорт только нужных функций из clsx
 * - Типизация через отдельный файл types
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = clsx(baseClasses, variantClasses[variant], sizeClasses[size], disabledClasses, className);

  return (
    <button type={type} className={buttonClasses} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
