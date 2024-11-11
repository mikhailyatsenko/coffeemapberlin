import { RatePlace } from 'entities/RatePlace';
import { type ICharacteristicCounts, type Review } from 'shared/types';
import cls from './RateNow.module.scss';

interface RateNowProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RateNow = ({
  reviews,
  placeId,
  characteristicCounts,
  setShowRateNow,
  showRateNow: showReviewForm,
}: RateNowProps) => {
  const currentUserReview = reviews.find((review) => review.isOwnReview);
  const hasReviewWithText = reviews.some((review) => review.isOwnReview && review.text.trim() !== '');

  // if (hasRating && hasReviewWithText) return null;

  return (
    <div>
      {!showReviewForm && (
        <div className={cls.rateNowContainer}>
          <h4 className={cls.question}>
            Have you visited this place?{' '}
            <span
              onClick={() => {
                setShowRateNow(true);
              }}
            >
              Rate it
            </span>
          </h4>
        </div>
      )}

      {showReviewForm && (
        <RatePlace
          setShowRateNow={setShowRateNow}
          placeId={placeId}
          characteristicCounts={characteristicCounts}
          userRating={currentUserReview?.userRating}
          hasReviewWithText={hasReviewWithText}
        />
      )}
    </div>
  );
};
