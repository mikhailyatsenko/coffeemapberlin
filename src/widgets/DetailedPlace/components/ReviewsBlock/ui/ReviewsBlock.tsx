import React from 'react';
import { AddTextReviewForm } from 'features/AddTextReview';
import { ReviewList } from 'features/ReviewList';
import { type Review } from 'shared/generated/graphql';
import cls from '../../../ui/DetailedPlace.module.scss';

interface ReviewsBlockProps {
  placeId: string;
  isEditingReview: boolean;
  ownReviewHasText: boolean;
  editInitialText: string;
  displayedReviews: Review[];
  onSubmitted: () => void;
  onCancel: () => void;
  onEditReview: (text: string) => void;
}

export const ReviewsBlock: React.FC<ReviewsBlockProps> = ({
  placeId,
  isEditingReview,
  ownReviewHasText,
  editInitialText,
  displayedReviews,
  onSubmitted,
  onCancel,
  onEditReview,
}) => (
  <div className={cls.block}>
    <h2 className={cls.blockTitle}>Reviews</h2>

    {(isEditingReview || !ownReviewHasText) && (
      <AddTextReviewForm
        id="review-form"
        placeId={placeId}
        initialValue={isEditingReview ? editInitialText : ''}
        onSubmitted={onSubmitted}
        onCancel={onCancel}
      />
    )}

    <ReviewList
      reviews={displayedReviews}
      placeId={placeId}
      isCompactView={false}
      setCompactView={() => {}}
      onEditReview={onEditReview}
    />
  </div>
);
