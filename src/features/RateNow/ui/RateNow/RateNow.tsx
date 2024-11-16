import { useState } from 'react';
import { RatePlaceWidget, ReviewForm, ToggleCharacteristic } from 'entities/RatePlace';
import { LeaveOrEditMyReview } from 'entities/RatePlace/ui/LeaveOrEditMyReview/ui/LeaveOrEditMyReview';
import { useAddReview } from 'shared/lib/hooks/interactions/useAddRating';
import { useAddTextReview } from 'shared/lib/hooks/interactions/useAddTextReview';
import { useToggleCharacteristic } from 'shared/lib/hooks/interactions/useToggleCharacteristic';
import { type ICharacteristicCounts, type Review } from 'shared/types';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './RateNow.module.scss';

interface RateNowProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const RateNow = ({ reviews, placeId, characteristicCounts, setShowRateNow, showRateNow }: RateNowProps) => {
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

  return (
    <div className={cls.RateNow}>
      {!showRateNow && (
        <div className={cls.rateNowCall}>
          <h4 className={cls.question}>
            Have you visited this place?{' '}
            <span
              onClick={() => {
                setShowRateNow(true);
              }}
            >
              Rate it
            </span>
          </h4>
        </div>
      )}

      {showRateNow && (
        <>
          <RegularButton
            theme="blank"
            type="button"
            className={cls.buttonBack}
            clickHandler={() => {
              setShowRateNow(false);
            }}
          >
            &#8612; Back
          </RegularButton>
          <RatePlaceWidget userRating={currentUserReview?.userRating} onSubmitRating={onSubmitRating} />
          <h3>Which of these did you notice?</h3>
          <ToggleCharacteristic toggleChar={toggleChar} characteristicCounts={characteristicCounts} />
          <LeaveOrEditMyReview review={currentUserReview?.text} buttonHandler={setShowReviewForm} />
          {showReviewForm && (
            <Modal
              desctopWidth={600}
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
        </>
      )}
    </div>
  );
};
