import { useState } from 'react';
import { ToggleCharacteristic } from 'entities/RatePlace/ui/ToggleCharacteristic/ToggleCharacteristic';
import { useAddReview } from 'shared/lib/hooks/interactions/useAddReview';
import { type ICharacteristicCounts } from 'shared/types';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { RegularButton } from 'shared/ui/RegularButton';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import cls from './RatePlace.module.scss';

interface ReviewCardProps {
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  userRating: number | undefined;
  hasReviewWithText: boolean;
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RatePlace = ({
  characteristicCounts,
  userRating,
  placeId,
  hasReviewWithText,
  setShowRateNow,
}: ReviewCardProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { handleAddReview, loading: reviewLoading } = useAddReview(placeId);
  const onSubmitTextReview = async (reviewText: string) => {
    await handleAddReview(reviewText);
  };

  return (
    <div className={cls.RatePlace}>
      <div className={cls.currentCharacterictics}></div>

      <div className={cls.rateWidget}>
        {userRating ? (
          <>
            <h3>Your rating</h3>
            <div className={cls.currentUserRate}>
              <BeanIcon filled />
              <div className={cls.currentUserRateNumber}>{userRating}</div>
            </div>
          </>
        ) : (
          <>
            <h3>Rate this place</h3>
            <RatingWidget isClickable={true} handleRating={handleAddReview} />
          </>
        )}
      </div>
      <h3>What did you like most?</h3>
      <ToggleCharacteristic placeId={placeId} characteristicCounts={characteristicCounts} />
      {!hasReviewWithText && showReviewForm && (
        <ReviewForm
          isLoading={reviewLoading}
          onSubmit={onSubmitTextReview}
          onBack={() => {
            setShowReviewForm(false);
          }}
        />
      )}

      <div className={cls.itemFullWidth}>
        <RegularButton
          theme="blank"
          type="button"
          clickHandler={() => {
            setShowRateNow(false);
          }}
        >
          &#8612; Back
        </RegularButton>
      </div>
    </div>
  );
};
