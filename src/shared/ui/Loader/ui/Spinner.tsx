import clsx from 'clsx';
import cls from './Spinner.module.scss';

export const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  return <span className={clsx(cls.spinner, cls[`size-${size}`])}></span>;
};
