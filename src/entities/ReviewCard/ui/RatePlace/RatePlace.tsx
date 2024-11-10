import { useState } from 'react';
import { ToggleCharacteristic } from 'entities/ReviewCard/ui/ToggleCharacteristic/ToggleCharacteristic';
import { useAddReview } from 'shared/lib/hooks/interactions/useAddReview';
import { type ICharacteristicCounts } from 'shared/types';
import { CharacteristicCountsIcon } from 'shared/ui/CharacteristicCountsIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { RegularButton } from 'shared/ui/RegularButton';
import { ReviewForm } from '../ReviewForm/ReviewForm';
import cls from './ReviewCard.module.scss';

interface ReviewCardProps {
  hasRating: boolean;
  hasReviewWithText: boolean;
  placeId: string;
  placeName: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RatePlace = ({
  characteristicCounts,
  hasRating,
  placeId,
  hasReviewWithText,
  placeName,
}: ReviewCardProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { handleAddReview, loading: reviewLoading } = useAddReview(placeId);
  const onSubmitTextReview = async (reviewText: string) => {
    await handleAddReview(reviewText);
  };

  return (
    <div className={cls.ReviewCard}>
      <h2>{placeName}</h2>
      {Object.keys(characteristicCounts)
        .filter((charKey) => charKey !== '__typename')
        .map((charKey) => (
          <CharacteristicCountsIcon
            characteristic={charKey}
            characteristicData={characteristicCounts[charKey as keyof ICharacteristicCounts]}
            key={charKey}
          />
        ))}
      <div className={cls.currentCharacterictics}></div>
      {!hasRating && (
        <>
          <div className={cls.rateWidget}>
            <h3>Rate this place:</h3>
            <RatingWidget isClickable={true} handleRating={handleAddReview} />
          </div>
          {hasReviewWithText && (
            <div className={cls.itemFullWidth}>
              <RegularButton
                theme="blank"
                type="button"
                clickHandler={() => {
                  setShowReviewForm(false);
                }}
              >
                &#8612; Back
              </RegularButton>
            </div>
          )}
        </>
      )}
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
    </div>
  );
};
