import clsx from 'clsx';
import { forwardRef, memo } from 'react';
import { type RegularButtonProps } from '../types';
import cls from './RegularButton.module.scss';

const styles: Record<string, string> = cls as unknown as Record<string, string>;

export const RegularButton = memo(
  forwardRef<HTMLButtonElement, RegularButtonProps>(
    (
      {
        type = 'button',
        disabled,
        theme = 'primary',
        variant = 'outline',
        size = 'md',
        className = '',
        children,
        onClick,
        fullWidth = false,
        loading = false,
        leftIcon,
        rightIcon,
        ...rest
      },
      ref,
    ) => {
      const isDisabled = disabled || loading;

      return (
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          aria-busy={loading || undefined}
          className={clsx(
            styles.RegularButton,
            styles[`theme-${theme}`],
            styles[`variant-${variant}`],
            styles[`size-${size}`],
            fullWidth && styles.fullWidth,
            isDisabled && styles.disabled,
            className,
          )}
          onClick={onClick}
          {...rest}
        >
          {loading && <span className={styles.spinner} aria-hidden />}
          {leftIcon && <span className={styles.icon}>{leftIcon}</span>}
          {children}
          {rightIcon && <span className={styles.icon}>{rightIcon}</span>}
        </button>
      );
    },
  ),
);
