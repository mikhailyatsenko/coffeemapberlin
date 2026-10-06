import clsx from 'clsx';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { type RatingSummaryProps } from '../types';
import cls from './RatingSummary.module.scss';

/** A Place's Average rating as beans and a number, with how many Ratings it comes from. Display-only. */
export const RatingSummary = ({ averageRating, ratingCount, size = 'medium' }: RatingSummaryProps) => (
  <div className={clsx(cls.ratingSummary, cls[size])}>
    {ratingCount > 0 ? (
      <>
        <RatingWidget isClickable={false} rating={averageRating} />
        {averageRating != null && <span className={cls.value}>{averageRating.toFixed(1)}</span>}
        <span className={cls.muted}>
          ({ratingCount} rating{ratingCount !== 1 ? 's' : ''})
        </span>
      </>
    ) : (
      <span className={cls.muted}>No ratings yet — be the first</span>
    )}
  </div>
);
