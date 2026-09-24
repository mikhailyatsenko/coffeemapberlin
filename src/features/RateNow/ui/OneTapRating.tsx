import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';

import { useOneTapRating } from '../model/useOneTapRating';
import { type OneTapRatingProps } from '../types';
import cls from './OneTapRating.module.scss';

export type { OneTapRatingProps };

/** Beans that save a Rating on one tap, for Users and Guests alike. */
export const OneTapRating = ({ placeId, rating, onSaved }: OneTapRatingProps) => {
  const { shownRating, isSaving, error, saveRating } = useOneTapRating({ placeId, rating, onSaved });

  return (
    <div className={cls.OneTapRating}>
      {/* Taps during a save are ignored, so the beans say so. */}
      <RatingWidget isClickable rating={shownRating} disabled={isSaving} handleRating={saveRating} />
      {error && (
        <p className={cls.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
