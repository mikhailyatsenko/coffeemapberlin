import { useState } from 'react';
// import { useAddReview } from 'shared/lib/hooks/interactions/useAddReview';
import { type ICharacteristicCounts, type Review } from 'shared/types';
import cls from './RateNow.module.scss';
import { Modal } from 'shared/ui/Modal';
import {RatePlace} from 'entities/ReviewCard/ui/RatePlace/RatePlace';

interface RateNowProps {
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
  placeName: string;
}

export const RateNow = ({ reviews, placeId, characteristicCounts, placeName }: RateNowProps) => {


  const [showReviewForm, setShowReviewForm] = useState(false);

  const hasRating = reviews.some((review) => review.isOwnReview && review.userRating !== null);
  const hasReviewWithText = reviews.some((review) => review.isOwnReview && review.text.trim() !== '');



  if (hasRating && hasReviewWithText) return null;

  return (
    <div>
      {!showReviewForm && (
        <div className={cls.rateNowContainer}>
          <h4 className={cls.question}>
            Have you visited this place?{' '}
            <span
              onClick={() => {
                setShowReviewForm(true);
              }}
            >
              Rate it
            </span>
          </h4>
        </div>
      )}

      {showReviewForm && <Modal onClose={()=> setShowReviewForm(false)}>
       <RatePlace placeName={placeName} placeId={placeId} characteristicCounts={characteristicCounts} hasRating={hasRating} hasReviewWithText={hasReviewWithText} />
      </Modal>
      
      }

      {reviews.length === 0 && !showReviewForm && (
        <div className={cls.noReviews}>
          <p>There are no reviews yet.</p>
          <p>
            Be first to{' '}
            <span
              onClick={() => {
                setShowReviewForm(true);
              }}
            >
              write one
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
