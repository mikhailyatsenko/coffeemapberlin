import { useState } from 'react';
import { ToggleCharacteristic } from 'entities/RatePlace';
import { useToggleCharacteristic } from 'shared/api';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import { type Characteristic } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { Modal } from 'shared/ui/Modal';
import { RegularButton } from 'shared/ui/RegularButton';

import { getSaveErrorMessage } from '../lib/getSaveErrorMessage';
import { type RateNowProps } from '../types';
import { OneTapRating } from './OneTapRating';
import cls from './RateNow.module.scss';

export const RateNow = ({
  reviews,
  placeId,
  characteristicCounts,
  setShowRateNow,
  showRateNow,
  ...props
}: RateNowProps) => {
  const [characteristicError, setCharacteristicError] = useState<string | null>(null);
  const [isRatingSaved, setIsRatingSaved] = useState(false);

  const { toggleChar } = useToggleCharacteristic(placeId);

  const onToggleCharacteristic = async (characteristic: Characteristic) => {
    setCharacteristicError(null);
    try {
      await toggleChar(characteristic);
    } catch (error) {
      setCharacteristicError(getSaveErrorMessage(error));
    }
  };

  const currentUserReview = reviews.find((review) => review.isOwnReview);

  const handleRatePlaceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    trackEvent('rate_place_click', {
      item_id: placeId,
      item_name: 'click on rate place',
      category: 'engagement',
    });
    setCharacteristicError(null);
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
            <h3 className={cls.heading}>Rate this place</h3>
            <OneTapRating
              placeId={placeId}
              rating={currentUserReview?.userRating}
              onSaved={() => {
                setIsRatingSaved(true);
              }}
            />
            {isRatingSaved && (
              <p className={cls.confirmation} role="status">
                Thanks for your rating! Anything that stood out? Mark it below.
              </p>
            )}
            {characteristicError && (
              <p className={cls.error} role="alert">
                {characteristicError}
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
