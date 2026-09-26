import { useCardContribution } from '../model/useCardContribution';
import { type CardContributionProps } from '../types';
import cls from './CardContribution.module.scss';
import { OneTapRating } from './OneTapRating';

export type { CardContributionProps };

/** "Been here? Rate it" on a Place card: the one-tap Rating, then the person's Rating with "change". */
export const CardContribution = (props: CardContributionProps) => {
  const { placeId, ownRating, section } = props;
  const { currentRating, showsBeans, handleRate, handleSaved, handleSaveFailed, startChange } =
    useCardContribution(props);

  return (
    <div className={cls.CardContribution}>
      {showsBeans && <p className={cls.heading}>Been here? Rate it</p>}
      {/* Stays mounted while hidden, so a save in flight can still report a failure. */}
      <div className={cls.beans} hidden={!showsBeans}>
        <OneTapRating
          placeId={placeId}
          rating={ownRating}
          surfaceParams={{ surface: 'neighborhood_card', section }}
          onRate={handleRate}
          onSaved={handleSaved}
          onFailed={handleSaveFailed}
        />
      </div>
      <div role="status">
        {!showsBeans && (
          <p className={cls.rating}>
            Your rating: {currentRating} ·{' '}
            <button type="button" className={cls.change} onClick={startChange}>
              change
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
