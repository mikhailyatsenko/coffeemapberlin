import { RatePlaceWidget, ToggleCharacteristic } from 'entities/RatePlace';
import { useDeleteReview, useToggleCharacteristic } from 'shared/api';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import { PlaceDocument, PlaceReviewsDocument, useAddRatingMutation } from 'shared/generated/graphql';
import { revalidatePlaces } from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';

import { type RateNowProps } from '../types';
import cls from './RateNow.module.scss';

export const RateNow = ({ reviews, placeId, characteristicCounts, setShowRateNow, showRateNow }: RateNowProps) => {
  const { handleDeleteReview } = useDeleteReview(placeId);

  const [addRating, { loading: loadingRating }] = useAddRatingMutation({
    onCompleted() {
      revalidatePlaces();
    },
  });

  const onSubmitRating = async (rating: number) => {
    await addRating({
      variables: { placeId, rating },
      refetchQueries: [
        { query: PlaceDocument, variables: { placeId } },
        { query: PlaceReviewsDocument, variables: { placeId } },
      ],
      awaitRefetchQueries: true,
    });
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
          rightIcon={<EditIcon width={16} height={16} />}
          onClick={() => {
            setShowRateNow(true);
          }}
        >
          {currentUserReview?.userRating ? `Your given rating: ${currentUserReview?.userRating}` : 'Edit your feedback'}
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
