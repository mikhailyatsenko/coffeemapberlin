import clsx from 'clsx';
import { Skeleton } from 'shared/ui/Skeleton';
import cls from './NeighborhoodPlaceCard.module.scss';

/** The shape of a compact shelf card while its Place loads; hide it from screen readers with its shelf. */
export const NeighborhoodPlaceCardSkeleton = () => (
  <div className={clsx(cls.card, cls.skeletonCard)}>
    <Skeleton className={cls.imageContainer} />
    <div className={cls.content}>
      <div className={cls.header}>
        <div className={cls.titleSkeleton}>
          <Skeleton className={cls.titleLineSkeleton} />
          <Skeleton className={cls.titleLineSkeleton} />
        </div>
        <Skeleton className={cls.favoriteSkeleton} />
      </div>
      <Skeleton className={cls.ratingSkeleton} />
      <Skeleton className={cls.iconsSkeleton} />
      <Skeleton className={cls.addressSkeleton} />
    </div>
  </div>
);
