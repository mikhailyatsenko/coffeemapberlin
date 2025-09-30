import { memo } from 'react';
import { useDeleteReview } from 'shared/api';
import { ReviewCard } from 'shared/ui/ReviewCard';
import { sortReviews } from '../lib/sortReviews';
import { type ReviewListProps } from '../types';
import cls from './ReviewList.module.scss';

const ReviewListComponent = ({
  reviews,
  placeId,
  isCompactView,
  setCompactView,
  setShowRateNow = () => {},
  showRateNow = false,
  onEditReview,
}: ReviewListProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);

  if (showRateNow) return null;

  if (reviews.length === 0)
    return (
      <div className={cls.noReviews}>
        <p>There are no reviews yet.</p>
        <p>
          Be first to{' '}
          <span
            onClick={() => {
              setShowRateNow(true);
            }}
          >
            write one
          </span>
        </p>
      </div>
    );

  const sortedReviews = sortReviews(reviews);

  return (
    <div className={cls.reviewsContainer}>
      {isCompactView && (
        <h4
          onClick={() => {
            setCompactView(false);
          }}
          className={cls.reviewsTitle}
        >
          Reviews ({reviews.length})
        </h4>
      )}

      <div className={cls.reviewsList}>
        {sortedReviews.map((review, index) => (
          <ReviewCard
            key={`${review.id}-${review.createdAt}-${index}`}
            reviewId={review.id}
            isGoogleReview={review.isGoogleReview}
            placeId={placeId}
            rating={review.userRating ?? undefined}
            reviewText={review.text ?? undefined}
            userName={review.userName}
            isOwnReview={review.isOwnReview}
            userAvatar={review.userAvatar ?? undefined}
            setShowRateNow={setShowRateNow}
            handleDeleteReview={handleDeleteReview}
            createdAt={review.createdAt}
            reviewImages={review.reviewImages}
            userId={review.userId}
            onEditReview={onEditReview}
            characteristics={review.characteristics ?? undefined}
          />
        ))}
      </div>
    </div>
  );
};

export const ReviewList = memo(
  ReviewListComponent,
  (prevProps, nextProps) =>
    prevProps.reviews === nextProps.reviews &&
    prevProps.showRateNow === nextProps.showRateNow &&
    prevProps.isCompactView === nextProps.isCompactView,
);
