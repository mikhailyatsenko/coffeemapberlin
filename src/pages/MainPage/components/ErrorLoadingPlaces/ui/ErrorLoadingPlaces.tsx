import React from 'react';
import { RegularButton } from 'shared/ui/RegularButton/ui/RegularButton';
import cls from './ErrorLoadingPlaces.module.scss';

interface ErrorLoadingPlacesProps {
  error?: Error;
  onRetry?: () => void;
}

export const ErrorLoadingPlaces: React.FC<ErrorLoadingPlacesProps> = ({ error, onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={cls.container}>
      <div className={cls.content}>
        <div className={cls.icon}>⚠️</div>
        <h1 className={cls.title}>Unable to Load Places</h1>
        <p className={cls.message}>
          We&apos;re having trouble loading the places data. This could be a temporary network issue.
        </p>
        <p className={cls.subMessage}>Please try refreshing the page or check your internet connection.</p>

        {error && process.env.NODE_ENV === 'development' && (
          <details className={cls.errorDetails}>
            <summary>Error details (development only)</summary>
            <pre className={cls.errorText}>{error.message}</pre>
          </details>
        )}

        <div className={cls.actions}>
          <RegularButton variant="solid" size="lg" onClick={handleRetry} type="button">
            Retry
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
