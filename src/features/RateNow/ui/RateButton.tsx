import EditIcon from 'shared/assets/edit-icon.svg?react';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';
import { RegularButton } from 'shared/ui/RegularButton';

import { getActor } from '../lib/getActor';
import { type RateButtonProps } from '../types';

export type { RateButtonProps };

/** The Place header's way to the "Been here? Rate it" block; shows the person's Rating once there is one. */
export const RateButton = ({ placeId, rating, onClick }: RateButtonProps) => {
  const user = useAuthStore((s) => s.user);

  const handleClick = () => {
    trackEvent('rate_place_click', {
      place_id: placeId,
      actor: getActor(user),
      // The params this event carried before the block, kept so older GA reports still match.
      item_id: placeId,
      item_name: 'click on rate place',
      category: 'engagement',
    });
    onClick();
  };

  return rating ? (
    <RegularButton
      variant="ghost"
      theme="neutral"
      rightIcon={<EditIcon width={16} height={16} />}
      onClick={handleClick}
    >
      Your rating: {rating}
    </RegularButton>
  ) : (
    <RegularButton onClick={handleClick}>Rate place</RegularButton>
  );
};
