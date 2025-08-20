import { RatePlaceWidget, ToggleCharacteristic } from 'entities/RatePlace';
import { useDeleteReview, useToggleCharacteristic } from 'shared/api';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { useAddRating } from '../hooks';

import { type RateNowProps } from '../types';
import cls from './RateNow.module.scss';

export const RateNow = ({ reviews, placeId, characteristicCounts, setShowRateNow, showRateNow }: RateNowProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);

  const { handleAddRating, loading: loadingRating } = useAddRating(placeId);

  const onSubmitRating = async (rating: number) => {
    await handleAddRating(rating);
  };

  const { toggleChar } = useToggleCharacteristic(placeId);

  const currentUserReview = reviews.find((review) => review.isOwnReview);

  if (loadingRating) return <Loader />;

  const handleDeleteMyRating = () => {
    if (currentUserReview) {
      const isConfirmed = window.confirm('Deleting your rating. Continue?');
      if (!isConfirmed) return;
      handleDeleteReview(currentUserReview?.id, 'deleteRating');
    }
  };

  const { __typename: _omit, ...charCounts } = characteristicCounts;

  const hasUserInteracted =
    !!currentUserReview?.userRating || Object.values(charCounts).some((characteristic) => characteristic.pressed);

  return (
    <>
      {hasUserInteracted ? (
        <RegularButton
          variant={'ghost'}
          theme={'neutral'}
          onClick={() => {
            setShowRateNow(true);
          }}
        >
          Edit my feedback
          <EditIcon width={16} height={16} />
        </RegularButton>
      ) : (
        <RegularButton
          className={cls.primaryBtn}
          onClick={() => {
            setShowRateNow(true);
          }}
          type="button"
        >
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
              handleDeleteMyRating={handleDeleteMyRating}
              userRating={currentUserReview?.userRating}
              reviewId={currentUserReview?.id}
              onSubmitRating={onSubmitRating}
            />
            <div className={cls.characteristicWidget}>
              <h4>What made your visit special?</h4>
              <ToggleCharacteristic toggleChar={toggleChar} characteristicCounts={characteristicCounts} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
