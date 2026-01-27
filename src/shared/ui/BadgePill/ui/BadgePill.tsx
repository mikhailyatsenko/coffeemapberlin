import clsx from 'clsx';
import { type BadgePillProps } from '../types';
import cls from './BadgePill.module.scss';

export const BadgePill = ({ text, color = 'green', size = 'small', hover, className }: BadgePillProps) => {
  const hoverClass = hover ? cls[`hover-${hover}`] : undefined;
  return <div className={clsx(cls.badgePill, cls[size], cls[color], hoverClass, className)}>{text}</div>;
};
