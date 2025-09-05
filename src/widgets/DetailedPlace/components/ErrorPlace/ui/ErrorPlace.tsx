import React from 'react';
import cls from './ErrorPlace.module.scss';

interface ErrorPlaceProps {
  error?: Error;
  onRetry?: () => void;
}

export const ErrorPlace: React.FC<ErrorPlaceProps> = ({ error, onRetry }) => {
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
        <h1 className={cls.title}>Something went wrong</h1>
        <p className={cls.message}>We encountered an error while loading this place. Please try refreshing the page.</p>
        <p className={cls.subMessage}>
          If the problem persists, please check that the URL is correct and try again later.
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <details className={cls.errorDetails}>
            <summary>Error details (development only)</summary>
            <pre className={cls.errorText}>{error.message}</pre>
          </details>
        )}

        <div className={cls.actions}>
          <button className={cls.retryButton} onClick={handleRetry} type="button">
            Refresh Page
          </button>
          <a href="/" className={cls.backButton}>
            Back to Map
          </a>
        </div>
      </div>
    </div>
  );
};
