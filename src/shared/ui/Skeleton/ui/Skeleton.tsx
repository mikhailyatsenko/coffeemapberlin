import clsx from 'clsx';
import cls from './Skeleton.module.scss';

interface SkeletonProps {
  /** Sizes the block to the content it stands in for. */
  className?: string;
}

/** A grey block that holds the place of content still loading. Hide its container from screen readers. */
export const Skeleton = ({ className }: SkeletonProps) => <span className={clsx(cls.skeleton, className)} />;
