import React from 'react';
import { AddTextReviewForm } from 'features/AddTextReview';
import { ReviewList } from 'features/ReviewList';
import { type Review } from 'shared/generated/graphql';
import { REVIEW_TEXT_SELECTOR } from '../../../constants/reviewText';
import cls from '../../../ui/DetailedPlace.module.scss';

interface ReviewsBlockProps {
  placeId: string;
  isEditingReview: boolean;
  ownReviewHasText: boolean;
  /** Photos the person's own Review already has. */
  ownReviewPhotoCount: number;
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
  ownReviewPhotoCount,
  editInitialText,
  displayedReviews,
  onSubmitted,
  onCancel,
  onEditReview,
}) => {
  const isFormShown = isEditingReview || !ownReviewHasText;

  const focusReviewText = () => {
    document.querySelector<HTMLTextAreaElement>(REVIEW_TEXT_SELECTOR)?.focus();
  };

  return (
    <div className={cls.block}>
      <h2 className={cls.blockTitle}>Reviews</h2>

      {isFormShown && (
        <AddTextReviewForm
          id="review-form"
          placeId={placeId}
          initialValue={isEditingReview ? editInitialText : ''}
          existingPhotoCount={ownReviewPhotoCount}
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
        onWriteReview={isFormShown ? focusReviewText : undefined}
      />
    </div>
  );
};
