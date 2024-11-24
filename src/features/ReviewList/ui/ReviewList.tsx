import { useCallback, useEffect, useState } from 'react';
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
  const { handleDeleteReview } = useDeleteReview(placeId);

  const [reviewsListRef, setReviewsListRef] = useState<HTMLDivElement | null>(null);

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    setReviewsListRef(node);
  }, []);

  useEffect(() => {
    console.log('inside scroll useEffect');
    if (!reviewsListRef) return;

    const handleScrollReviews = () => {
      const scrollTop = reviewsListRef.scrollTop;
      if (isCompactView) {
        setCompactView(scrollTop < 100);
      } else {
        setCompactView(scrollTop < 10);
      }
    };

    reviewsListRef.addEventListener('scroll', handleScrollReviews);
    return () => {
      reviewsListRef.removeEventListener('scroll', handleScrollReviews);
    };
  }, [reviewsListRef, isCompactView, setCompactView]);

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
      <div ref={handleRef} className={cls.reviewsList}>
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
