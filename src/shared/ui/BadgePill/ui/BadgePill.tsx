import clsx from 'clsx';
import { type BadgePillProps } from '../types';
import cls from './BadgePill.module.scss';

export const BadgePill = ({ text, color = 'green', size = 'small', className }: BadgePillProps) => {
  return <div className={clsx(cls.badgePill, cls[size], cls[color], className)}>{text}</div>;
};
