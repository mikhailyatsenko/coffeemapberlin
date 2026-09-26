import cls from './ErrorAlert.module.scss';

/** The block's error line: why the last save failed. */
export const ErrorAlert = ({ children }: { children: React.ReactNode }) => (
  <p className={cls.ErrorAlert} role="alert">
    {children}
  </p>
);
