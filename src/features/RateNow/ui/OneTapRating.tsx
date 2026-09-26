import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import { ErrorAlert } from '../components/ErrorAlert';
import { useOneTapRating } from '../model/useOneTapRating';
import { type OneTapRatingProps } from '../types';
import cls from './OneTapRating.module.scss';

export type { OneTapRatingProps };

/** Beans that save a Rating on one tap, for Users and Guests alike. */
export const OneTapRating = (props: OneTapRatingProps) => {
  const { shownRating, isSaving, error, saveRating } = useOneTapRating(props);

  return (
    <div className={cls.OneTapRating}>
      {/* Taps during a save are ignored, so the beans say so. */}
      <RatingWidget isClickable rating={shownRating} disabled={isSaving} handleRating={saveRating} />
      {error && <ErrorAlert>{error}</ErrorAlert>}
    </div>
  );
};
