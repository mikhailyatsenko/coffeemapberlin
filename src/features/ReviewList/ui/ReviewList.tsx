import { useCallback, useEffect, useRef } from 'react';
import { useDeleteReview } from 'shared/lib/hooks/interactions/useDeleteReview';
import { type Review } from 'shared/types';
import { ReviewCard } from 'shared/ui/ReviewCard';
import { sortReviews } from '../lib/sortReviews';
import cls from './ReviewList.module.scss';

interface ReviewListProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  isCompactView: boolean;
  setCompactView: (isCompact: boolean) => void;
}

export const ReviewList = ({
  reviews,
  placeId,
  isCompactView,
  setCompactView,
  setShowRateNow,
  showRateNow,
}: ReviewListProps) => {
  const reviewsListRef = useRef<HTMLDivElement>(null);

  const { handleDeleteReview } = useDeleteReview(placeId);

  const handleScrollReviewsDown = useCallback(() => {
    if (reviewsListRef.current && isCompactView) {
      const scrollTop = reviewsListRef.current.scrollTop;
      setCompactView(scrollTop < 100);
    }

    if (reviewsListRef.current && !isCompactView) {
      const scrollTop = reviewsListRef.current.scrollTop;
      setCompactView(scrollTop < 10);
    }
  }, [isCompactView, setCompactView]);

  useEffect(() => {
    const reviewsList = reviewsListRef.current;
    if (reviewsList) {
      reviewsList.addEventListener('scroll', handleScrollReviewsDown);
      return () => {
        reviewsList.removeEventListener('scroll', handleScrollReviewsDown);
      };
    }
  }, [handleScrollReviewsDown]);

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

  return (
    <div className={cls.reviewsContainer}>
      <h4
        onClick={() => {
          setCompactView(!isCompactView);
        }}
        className={cls.reviewsTitel}
      >
        Reviews ({reviews.length})
      </h4>
      <div ref={reviewsListRef} className={cls.reviewsList}>
        {sortReviews(reviews).map((review) => (
          <ReviewCard
            key={`${review.id}-${review.createdAt}`}
            id={review.id}
            rating={review.userRating}
            reviewText={review.text}
            userName={review.userName}
            isOwnReview={review.isOwnReview}
            userAvatar={review.userAvatar}
            handleDeleteReview={handleDeleteReview}
            createdAt={review.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
