import { useState } from 'react';
import { RatePlaceWidget, ReviewForm, ToggleCharacteristic } from 'entities/RatePlace';
import { LeaveOrEditMyReview } from 'entities/RatePlace/ui/LeaveOrEditMyReview/ui/LeaveOrEditMyReview';
import { useDeleteReview, useToggleCharacteristic } from 'shared/api';
import BackIcon from 'shared/assets/back-icon.svg?react';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { useAddRating, useAddTextReview } from '../hooks';
import { type RateNowProps } from '../types';
import cls from './RateNow.module.scss';

export const RateNow = ({ reviews, placeId, characteristicCounts, setShowRateNow, showRateNow }: RateNowProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { handleAddTextReview, loading: loadingReview } = useAddTextReview(placeId);
  const { handleAddRating, loading: loadingRating } = useAddRating(placeId);

  const onSubmitTextReview = async (reviewText: string) => {
    await handleAddTextReview(reviewText).then(() => {
      setShowReviewForm(false);
    });
  };

  const onSubmitRating = async (rating: number) => {
    await handleAddRating(rating);
  };

  const { toggleChar } = useToggleCharacteristic(placeId);

  const currentUserReview = reviews.find((review) => review.isOwnReview);

  if (loadingRating || loadingReview) return <Loader />;

  const handleDeleteMyRating = () => {
    if (currentUserReview) {
      const isConfirmed = window.confirm('Deleting your rating. Continue?');
      if (!isConfirmed) return;
      handleDeleteReview(currentUserReview?.id, 'deleteRating');
    }
  };

  const handleDeleteMyTextReview = () => {
    if (currentUserReview) {
      const isConfirmed = window.confirm('Deleting your review. Continue?');
      if (!isConfirmed) return;
      handleDeleteReview(currentUserReview?.id, 'deleteReviewText');
    }
  };

  const hasUserInteracted =
    !!currentUserReview || Object.values(characteristicCounts).some((characteristic) => characteristic.pressed);

  if (!showRateNow) {
    if (!hasUserInteracted)
      return (
        <div
          onClick={() => {
            setShowRateNow(true);
          }}
          className={cls.rateNowCall}
        >
          <h5 className={cls.question}>Have you visited this place?</h5>
          <RegularButton theme={'blank'}>Share Your Thoughts</RegularButton>
        </div>
      );

    if (hasUserInteracted && !currentUserReview)
      return (
        <div className={cls.rateNowCall}>
          <RegularButton
            theme={'blank'}
            onClick={() => {
              setShowRateNow(true);
            }}
          >
            Edit my feedback
            <EditIcon width={16} height={16} />
          </RegularButton>
        </div>
      );
  } else
    return (
      <div className={cls.RateNow}>
        <div className={cls.feedbackHeader}>
          <div
            className={cls.buttonBack}
            onClick={() => {
              setShowRateNow(false);
            }}
          >
            <BackIcon className={cls.backIcon} /> Back
          </div>

          <h4 className={cls.feedbackTitle}>Your feedback</h4>
        </div>

        {showRateNow && (
          <div className={cls.feedbackInteractions}>
            <RatePlaceWidget
              handleDeleteMyRating={handleDeleteMyRating}
              userRating={currentUserReview?.userRating}
              reviewId={currentUserReview?.id}
              onSubmitRating={onSubmitRating}
            />
            <div className={cls.characteristicWidget}>
              <h4>What made your visit special?</h4>
              <ToggleCharacteristic toggleChar={toggleChar} characteristicCounts={characteristicCounts} />
            </div>

            <LeaveOrEditMyReview
              handleDeleteMyTextReview={handleDeleteMyTextReview}
              reviewText={currentUserReview?.text}
              leaveTextReviewHandler={setShowReviewForm}
            />
            {showReviewForm && (
              <Modal
                widthOnDesktop={600}
                onClose={() => {
                  setShowReviewForm(false);
                }}
              >
                <ReviewForm
                  initialValue={currentUserReview?.text}
                  onSubmit={onSubmitTextReview}
                  onClose={() => {
                    setShowReviewForm(false);
                  }}
                />
              </Modal>
            )}
          </div>
        )}
      </div>
    );
};
