import { useCallback, useEffect, useState } from 'react';
import { useDeleteReview } from 'shared/lib/hooks/interactions/useDeleteReview';
import { type Review } from 'shared/types';
import { ReviewCard } from 'shared/ui/ReviewCard';
import CollapseIcon from '../../../shared/assets/collapse-icon.svg?react';
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
    if (!reviewsListRef) return;

    const handleScrollReviewsExpand = () => {
      const scrollTop = reviewsListRef.scrollTop;
      if (isCompactView && scrollTop > 100) {
        setCompactView(false);
      }
    };

    reviewsListRef.addEventListener('scroll', handleScrollReviewsExpand);

    return () => {
      reviewsListRef.removeEventListener('scroll', handleScrollReviewsExpand);
    };
  }, [isCompactView, reviewsListRef, setCompactView]);

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
      {!isCompactView && (
        <div
          className={cls.reviewsCollapse}
          onClick={() => {
            setCompactView(true);
          }}
        >
          Collapse reviews
          <CollapseIcon className={cls.collapseIcon} />
        </div>
      )}

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
