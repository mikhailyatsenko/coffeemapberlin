import { useEffect, useRef, useState } from 'react';
import { useToggleCharacteristic } from 'shared/api';
import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';

import { getActor } from '../../../lib/getActor';
import { getSaveErrorMessage } from '../../../lib/getSaveErrorMessage';
import { type SavingToggles } from '../../../types';
import { MARKS_ORDER } from '../constants/marks';

/**
 * The Characteristics the person has marked for the Place, all eight kinds. Removing one
 * un-marks it through the optimistic toggle; a failed removal brings the chip back with a message.
 */
export const useYourMarks = ({
  placeId,
  characteristicCounts,
  onRemove,
  saving,
  whileSaving,
  onAllRemoved,
}: SavingToggles & {
  placeId: string;
  characteristicCounts: CharacteristicCounts;
  onRemove: (characteristic: Characteristic) => void;
  /** Takes focus once the last chip is removed. */
  onAllRemoved: () => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const { toggleChar } = useToggleCharacteristic(placeId);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  // Set by a removal, so the chips never take focus on their own.
  const shouldMoveFocusRef = useRef(false);

  // A chip whose toggle is saving is left out: a removal leaves at once, and a Yes shows once confirmed.
  const marks = MARKS_ORDER.filter(
    (characteristic) => characteristicCounts[characteristic].pressed && !saving.includes(characteristic),
  );

  // The removed chip is gone, so focus moves to the first one left, or back to the Rating.
  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    const firstChip = listRef.current?.querySelector<HTMLElement>('button');
    if (firstChip) {
      firstChip.focus();
    } else {
      onAllRemoved();
    }
  });

  const remove = async (characteristic: Characteristic) => {
    // Only ever un-marks: the toggle would mark a Characteristic that is not marked.
    if (!characteristicCounts[characteristic].pressed || saving.includes(characteristic)) return;
    shouldMoveFocusRef.current = true;
    onRemove(characteristic);
    await whileSaving(characteristic, async () => {
      try {
        await toggleChar(characteristic);
        setError(null);
        trackEvent('characteristic_removed', { place_id: placeId, actor: getActor(user), characteristic });
      } catch (saveError) {
        setError(getSaveErrorMessage(saveError));
      }
    });
  };

  return { listRef, marks, remove, error };
};
