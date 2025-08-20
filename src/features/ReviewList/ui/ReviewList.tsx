import { memo, useCallback, useEffect, useState } from 'react';
import { useDeleteReview } from 'shared/api';
import CollapseIcon from 'shared/assets/collapse-icon.svg?react';
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

  const [reviewsListRef, setReviewsListRef] = useState<HTMLDivElement | null>(null);

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    setReviewsListRef(node);
  }, []);

  useEffect(() => {
    if (!reviewsListRef) return;

    const handleScrollReviewsExpand = () => {
      const scrollTop = reviewsListRef.scrollTop;
      if (isCompactView && scrollTop > 180) {
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
        {sortedReviews.map((review, index) => (
          <ReviewCard
            key={`${review.id}-${review.createdAt}-${index}`}
            reviewId={review.id}
            placeId={placeId}
            rating={review.userRating}
            reviewText={review.text}
            userName={review.userName}
            isOwnReview={review.isOwnReview}
            userAvatar={review.userAvatar}
            setShowRateNow={setShowRateNow}
            handleDeleteReview={handleDeleteReview}
            createdAt={review.createdAt}
            imgCount={review.imgCount}
            userId={review.userId}
            onEditReview={onEditReview}
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
