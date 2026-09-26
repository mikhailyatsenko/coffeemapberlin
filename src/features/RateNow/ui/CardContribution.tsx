import { CharacteristicQuestion } from '../components/CharacteristicQuestion';
import { ErrorAlert } from '../components/ErrorAlert';
import { useCardContribution } from '../model/useCardContribution';
import { useCardQuestion } from '../model/useCardQuestion';
import { type CardContributionProps, type SurfaceParams } from '../types';
import cls from './CardContribution.module.scss';
import { OneTapRating } from './OneTapRating';

export type { CardContributionProps };

/**
 * "Been here? Rate it" on a Place card: the one-tap Rating, then the person's Rating
 * with "change" and, on cards that ask one, a question about a Characteristic.
 */
export const CardContribution = (props: CardContributionProps) => {
  const { placeId, ownRating, section } = props;
  const surfaceParams: SurfaceParams = { surface: 'neighborhood_card', section };
  const { changeButtonRef, currentRating, showsBeans, handleRate, handleSaved, handleSaveFailed, startChange } =
    useCardContribution(props);
  const { questionText, answerYes, skip, error } = useCardQuestion({
    ...props,
    hasRating: currentRating !== null,
    surfaceParams,
    // The question is gone once answered; "change" is the nearest control left.
    onAnswer: () => changeButtonRef.current?.focus(),
  });

  return (
    <div className={cls.CardContribution}>
      {showsBeans && <p className={cls.heading}>Been here? Rate it</p>}
      {/* Stays mounted while hidden, so a save in flight can still report a failure. */}
      <div className={cls.beans} hidden={!showsBeans}>
        <OneTapRating
          placeId={placeId}
          rating={ownRating}
          surfaceParams={surfaceParams}
          onRate={handleRate}
          onSaved={handleSaved}
          onFailed={handleSaveFailed}
        />
      </div>
      <div role="status">
        {!showsBeans && (
          <p className={cls.rating}>
            Your rating: {currentRating} ·{' '}
            <button ref={changeButtonRef} type="button" className={cls.change} onClick={startChange}>
              change
            </button>
          </p>
        )}
      </div>
      {questionText && (
        <div className={cls.question}>
          <CharacteristicQuestion text={questionText} onYes={answerYes} onSkip={skip} />
          {error && <ErrorAlert>{error}</ErrorAlert>}
        </div>
      )}
    </div>
  );
};
