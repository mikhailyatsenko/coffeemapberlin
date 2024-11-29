import { useState } from 'react';
import { RatePlaceWidget, ReviewForm, ToggleCharacteristic } from 'entities/RatePlace';
import { LeaveOrEditMyReview } from 'entities/RatePlace/ui/LeaveOrEditMyReview/ui/LeaveOrEditMyReview';
import { useAddReview } from 'shared/lib/hooks/interactions/useAddRating';
import { useAddTextReview } from 'shared/lib/hooks/interactions/useAddTextReview';
import { useDeleteReview } from 'shared/lib/hooks/interactions/useDeleteReview';
import { useToggleCharacteristic } from 'shared/lib/hooks/interactions/useToggleCharacteristic';
import { type ICharacteristicCounts, type Review } from 'shared/types';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';
import EditIcon from '../../../../shared/assets/edit-icon.svg?react';
import cls from './RateNow.module.scss';

interface RateNowProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RateNow = ({ reviews, placeId, characteristicCounts, setShowRateNow, showRateNow }: RateNowProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { handleAddTextReview, loading: loadingReview } = useAddTextReview(placeId);
  const { handleAddRating, loading: loadingRating } = useAddReview(placeId);

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

  const hasUserReviewed =
    !!currentUserReview || Object.values(characteristicCounts).some((characteristic) => characteristic.pressed);

  if (!showRateNow)
    return (
      <div className={cls.rateNowCall}>
        {!hasUserReviewed && (
          <>
            <h5 className={cls.question}>Have you visited this place?</h5>
            <RegularButton
              theme={'blank'}
              onClick={() => {
                setShowRateNow(true);
              }}
            >
              Share Your Thoughts
            </RegularButton>
          </>
        )}
        {hasUserReviewed && (
          <RegularButton
            theme={'blank'}
            onClick={() => {
              setShowRateNow(true);
            }}
          >
            Edit my feedback
            <EditIcon width={16} height={16} />
          </RegularButton>
        )}
      </div>
    );

  return (
    <div className={cls.RateNow}>
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
            review={currentUserReview?.text}
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
          <RegularButton
            theme="blank"
            type="button"
            onClick={() => {
              setShowRateNow(false);
            }}
          >
            &#8612; Back
          </RegularButton>
        </div>
      )}
    </div>
  );
};
