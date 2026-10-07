import { Skeleton } from 'shared/ui/Skeleton';
import cls from './NeighborhoodHeader.module.scss';

/** The summary's shape while the Places load: grey blocks for the numbers and "Open on the map". */
export const NeighborhoodSummarySkeleton = () => (
  <div className={cls.summary} aria-hidden="true">
    <Skeleton className={cls.numbersSkeleton} />
    <Skeleton className={cls.mapLinkSkeleton} />
  </div>
);
