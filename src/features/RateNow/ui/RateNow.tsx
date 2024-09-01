// import { RegularButton } from 'shared/ui/RegularButton';
import { useState } from 'react';
import { ReviewForm } from 'entities/ReviewForm';
import { type Review } from 'shared/types';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { RegularButton } from 'shared/ui/RegularButton';
import { useAddReview } from '../../../shared/lib/hooks/interactions/useAddReview';
import cls from './RateNow.module.scss';

interface RateNowProps {
  reviews: Review[];
  placeId: string;
}

export const RateNow = ({ reviews, placeId }: RateNowProps) => {
  const { handleAddReview, loading: reviewLoading } = useAddReview(placeId);

  const [showReviewForm, setShowReviewForm] = useState(false);

  const hasRating = reviews.some((review) => review.isOwnReview && review.userRating !== null);
  const hasReviewWithText = reviews.some((review) => review.isOwnReview && review.text.trim() !== '');

  const onSubmitTextReview = async (reviewText: string) => {
    await handleAddReview(reviewText);
    setShowReviewForm(false);
  };

  if (hasRating && hasReviewWithText) return null;

  return (
    <>
      {!showReviewForm && (
        <div className={cls.rateNowContainer}>
          <h4 className={cls.question}>
            Have you visited this place?{' '}
            <span
              onClick={() => {
                setShowReviewForm(true);
              }}
            >
              {hasRating ? 'Leave a review' : 'Rate it now'}
            </span>
          </h4>
        </div>
      )}

      {showReviewForm && (
        <div className={cls.addReviewCard}>
          {!hasRating && (
            <>
              <div className={cls.rateWidget}>
                <h3>Rate this place:</h3>
                <RatingWidget isClickable={true} id={placeId} handleRating={handleAddReview} />
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

          {!hasReviewWithText && (
            <ReviewForm
              isLoading={reviewLoading}
              onSubmit={onSubmitTextReview}
              onBack={() => {
                setShowReviewForm(false);
              }}
            />
          )}
        </div>
      )}

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
    </>
  );
};
