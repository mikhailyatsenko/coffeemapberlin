import { Skeleton } from 'shared/ui/Skeleton';
import cls from './SectionSwitcher.module.scss';

/** Top rated, four Shortlists and All: the row a Neighborhood usually gets. `.pillSkeleton` gives each its width. */
const PILLS = 6;

/** The switcher's row while the Places load, so the shelves don’t move down when it arrives; hide it from screen readers. */
export const SectionSwitcherSkeleton = () => (
  <div className={cls.switcher}>
    <div className={cls.list}>
      {Array.from({ length: PILLS }, (_, index) => (
        <Skeleton key={index} className={cls.pillSkeleton} />
      ))}
    </div>
  </div>
);
