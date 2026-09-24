import { useState } from 'react';
import { RatePlaceWidget, ToggleCharacteristic } from 'entities/RatePlace';
import { useDeleteReview, useToggleCharacteristic } from 'shared/api';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import {
  type Characteristic,
  PlaceDocument,
  PlaceReviewsDocument,
  useAddRatingMutation,
} from 'shared/generated/graphql';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';
import { revalidatePlaces } from 'shared/stores/places';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';

import { getSaveErrorMessage } from '../lib/getSaveErrorMessage';
import { type RateNowProps } from '../types';
import cls from './RateNow.module.scss';

export const RateNow = ({
  reviews,
  placeId,
  characteristicCounts,
  setShowRateNow,
  showRateNow,
  ...props
}: RateNowProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);
  const { user } = useAuthStore();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSavingRating, setIsSavingRating] = useState(false);
  const [isRatingSaved, setIsRatingSaved] = useState(false);
  // Bumped after each save so RatePlaceWidget leaves edit mode and shows the new Rating.
  const [ratingWidgetKey, setRatingWidgetKey] = useState(0);
  const [addRating] = useAddRatingMutation({
    onCompleted() {
      revalidatePlaces();
    },
  });

  const onSubmitRating = async (rating: number) => {
    if (isSavingRating) return;
    setIsSavingRating(true);
    setSaveError(null);
    setIsRatingSaved(false);
    try {
      // Guests rate too; the captcha runs once, when the identity is issued.
      const guestCredentials = user ? {} : await ensureGuestIdentity();

      await addRating({
        variables: { placeId, rating, ...guestCredentials },
        refetchQueries: [
          { query: PlaceDocument, variables: { placeId } },
          { query: PlaceReviewsDocument, variables: { placeId } },
        ],
        awaitRefetchQueries: true,
      });
      setIsRatingSaved(true);
      setRatingWidgetKey((key) => key + 1);
    } catch (error) {
      console.error('Error adding rating:', error);
      setSaveError(getSaveErrorMessage(error));
    } finally {
      setIsSavingRating(false);
    }
  };

  const { toggleChar } = useToggleCharacteristic(placeId);

  const onToggleCharacteristic = async (characteristic: Characteristic) => {
    setSaveError(null);
    try {
      await toggleChar(characteristic);
    } catch (error) {
      setSaveError(getSaveErrorMessage(error));
    }
  };

  const currentUserReview = reviews.find((review) => review.isOwnReview);

  const handleDeleteMyRating = () => {
    if (currentUserReview) {
      const isConfirmed = window.confirm('Deleting your rating. Continue?');
      if (!isConfirmed) return;
      setIsRatingSaved(false);
      handleDeleteReview(currentUserReview?.id, 'deleteRating');
    }
  };

  const handleRatePlaceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (process.env.VITE_ENV !== 'development') {
      window.gtag('event', 'rate_place_click', {
        item_id: placeId,
        item_name: 'click on rate place',
        category: 'engagement',
      });
    }
    setSaveError(null);
    setIsRatingSaved(false);
    setShowRateNow(true);
  };

  const { __typename: _omit, ...charCounts } = characteristicCounts;

  const hasUserInteracted =
    !!currentUserReview?.userRating || Object.values(charCounts).some((characteristic) => characteristic.pressed);

  return (
    <div {...props}>
      {hasUserInteracted ? (
        <RegularButton
          variant={'ghost'}
          theme={'neutral'}
          rightIcon={<EditIcon width={16} height={16} />}
          onClick={handleRatePlaceClick}
        >
          {currentUserReview?.userRating ? `Your given rating: ${currentUserReview?.userRating}` : 'Edit your feedback'}
        </RegularButton>
      ) : (
        <RegularButton className={cls.primaryBtn} onClick={handleRatePlaceClick} type="button">
          Rate place
        </RegularButton>
      )}
      {showRateNow && (
        <Modal
          onClose={() => {
            setShowRateNow(false);
          }}
        >
          <div className={cls.RateNow}>
            <RatePlaceWidget
              key={ratingWidgetKey}
              isSaving={isSavingRating}
              handleDeleteMyRating={user ? handleDeleteMyRating : undefined}
              userRating={currentUserReview?.userRating}
              reviewId={currentUserReview?.id}
              onSubmitRating={onSubmitRating}
            />
            {isRatingSaved && (
              <p className={cls.confirmation} role="status">
                Thanks for your rating! Anything that stood out? Mark it below.
              </p>
            )}
            {saveError && (
              <p className={cls.error} role="alert">
                {saveError}
              </p>
            )}
            <div className={cls.characteristicWidget}>
              <h4>What made your visit special?</h4>
              <ToggleCharacteristic toggleChar={onToggleCharacteristic} characteristicCounts={characteristicCounts} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
