import { useRateBlock } from '../model/useRateBlock';
import { type RateBlockProps } from '../types';
import { OneTapRating } from './OneTapRating';
import cls from './RateBlock.module.scss';

export type { RateBlockProps };

/** The Place page's "Been here? Rate it" block. */
export const RateBlock = ({ placeId, rating }: RateBlockProps) => {
  const {
    blockRef,
    beansRef,
    changeButtonRef,
    currentRating,
    showsBeans,
    isThanked,
    handleRate,
    handleSaveFailed,
    startChange,
  } = useRateBlock({ placeId, rating });

  return (
    <section ref={blockRef} className={cls.RateBlock}>
      {showsBeans && <h2 className={cls.heading}>Been here? Rate it</h2>}
      {/* Stays mounted while hidden, so a save in flight can still report a failure. */}
      <div ref={beansRef} hidden={!showsBeans}>
        <OneTapRating placeId={placeId} rating={rating} onRate={handleRate} onFailed={handleSaveFailed} />
      </div>
      {/* The one thank-you container; always present so screen readers announce what appears in it. */}
      <div className={cls.thanks} role="status">
        {!showsBeans && (
          <>
            {isThanked && <p className={cls.heading}>Thanks!</p>}
            <p>
              Your rating: {currentRating} ·{' '}
              <button ref={changeButtonRef} type="button" className={cls.change} onClick={startChange}>
                change
              </button>
            </p>
          </>
        )}
      </div>
    </section>
  );
};
