import clsx from 'clsx';
import { NeighborhoodPlaceCardSkeleton } from 'entities/NeighborhoodPlaceCard';
import { Skeleton } from 'shared/ui/Skeleton';
import { type ShelfColumns } from '../types';
import cls from './Shelf.module.scss';

interface ShelfSkeletonProps {
  columns: ShelfColumns;
  /** How many card placeholders to show. */
  count: number;
}

/** The shape of a shelf while its Places load; hide it from screen readers. */
export const ShelfSkeleton = ({ columns, count }: ShelfSkeletonProps) => (
  <div className={cls.section}>
    <Skeleton className={cls.titleSkeleton} />
    <ul className={clsx(cls.list, cls[`columns${columns}`])}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={cls.item}>
          <NeighborhoodPlaceCardSkeleton />
        </li>
      ))}
    </ul>
    <div className={cls.seeAll}>
      <Skeleton className={cls.seeAllSkeleton} />
    </div>
  </div>
);
