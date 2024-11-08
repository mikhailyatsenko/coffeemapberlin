import { useState } from 'react';
import { type ICharacteristicCounts, type Review } from 'shared/types';
import cls from './RateNow.module.scss';
import { Modal } from 'shared/ui/Modal';
import {RatePlace} from 'entities/ReviewCard/ui/RatePlace/RatePlace';

interface RateNowProps {
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RateNow = ({ reviews, placeId, characteristicCounts }: RateNowProps) => {


  const [showRatePlace, setShowRatePlace] = useState(false);

  const hasRating = reviews.some((review) => review.isOwnReview && review.userRating !== null);
  const hasReviewWithText = reviews.some((review) => review.isOwnReview && review.text.trim() !== '');



  if (hasRating && hasReviewWithText) return null;

  return (
    <>
      {!showRatePlace && (
        <div className={cls.rateNowContainer}>
          <h4 className={cls.question}>
            Have you visited this place?{' '}
            <span
              onClick={() => {
                setShowRatePlace(true);
              }}
            >
              Rate it
            </span>
          </h4>
        </div>
      )}

      {showRatePlace && <Modal onClose={()=> setShowRatePlace(false)}>
       <RatePlace placeId={placeId} characteristicCounts={characteristicCounts} hasRating={hasRating} hasReviewWithText={hasReviewWithText} />
      </Modal>
      
      }

      {reviews.length === 0 && !showRatePlace && (
        <div className={cls.noReviews}>
          <p>There are no reviews yet.</p>
          <p>
            Be first to{' '}
            <span
              onClick={() => {
                setShowRatePlace(true);
              }}
            >
              write one
            </span>
          </p>
        </div>
      )}
    </>
  );
};
