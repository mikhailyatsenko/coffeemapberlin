import { useEffect, useRef, useState } from 'react';
import { useToggleCharacteristic } from 'shared/api';
import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { getSaveErrorMessage, getSaveErrorReason } from 'shared/lib/saveError';
import { useAuthStore } from 'shared/stores/auth';

import { QUESTION_BATCH_SIZE } from '../../../constants/questions';
import { getActor } from '../../../lib/getActor';
import { getRemainingQuestions } from '../../../lib/getRemainingQuestions';
import { trackContributionFailed } from '../../../lib/trackContributionFailed';
import { type SavingToggles } from '../../../types';

/**
 * The Yes / Skip questions: the opinion Characteristics not yet marked, a batch at a
 * time. A Yes marks the Characteristic through the optimistic toggle; a failed Yes
 * brings its question back with a message. A Skip is handed to the block, which
 * remembers it for this page view only.
 */
export const useCharacteristicQuestions = ({
  placeId,
  characteristicCounts,
  dismissed,
  onSkip,
  saving,
  whileSaving,
}: SavingToggles & {
  placeId: string;
  characteristicCounts: CharacteristicCounts;
  /** Characteristics not to ask about in this page view. */
  dismissed: readonly Characteristic[];
  onSkip: (characteristic: Characteristic) => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const { toggleChar } = useToggleCharacteristic(placeId);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Set by an answer, so the questions never take focus on their own.
  const shouldMoveFocusRef = useRef(false);

  const remaining = getRemainingQuestions(characteristicCounts, [...dismissed, ...saving]);

  // The Characteristics asked in the current batch; those answered drop out of `questions`, not of the batch.
  const [batch, setBatch] = useState(() =>
    remaining.slice(0, QUESTION_BATCH_SIZE).map(({ characteristic }) => characteristic),
  );
  const questions = remaining.filter(({ characteristic }) => batch.includes(characteristic));
  const hasMoreQuestions = questions.length === 0 && remaining.length > 0;

  // The answered question is gone, so focus moves to the next one (or "More questions?").
  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    containerRef.current?.querySelector<HTMLElement>('button')?.focus();
  });

  const showMoreQuestions = () => {
    shouldMoveFocusRef.current = true;
    setBatch(remaining.slice(0, QUESTION_BATCH_SIZE).map(({ characteristic }) => characteristic));
  };

  const answerYes = async (characteristic: Characteristic) => {
    // Only ever marks: the toggle would un-mark a Characteristic that is already marked.
    if (characteristicCounts[characteristic].pressed || saving.includes(characteristic)) return;
    shouldMoveFocusRef.current = true;
    const actor = getActor(user);
    // While saving, its question is gone, before the optimistic toggle lands.
    await whileSaving(characteristic, async () => {
      try {
        await toggleChar(characteristic);
        setError(null);
        trackEvent('characteristic_answered', { place_id: placeId, actor, characteristic, answer: 'yes' });
      } catch (saveError) {
        // Its question comes back: it is still in the batch, or in a later one if "More questions?" was used meanwhile.
        setError(getSaveErrorMessage(saveError));
        trackContributionFailed(placeId, actor, { kind: 'characteristic', reason: getSaveErrorReason(saveError) });
      }
    });
  };

  const skip = (characteristic: Characteristic) => {
    shouldMoveFocusRef.current = true;
    onSkip(characteristic);
    setError(null);
    trackEvent('characteristic_answered', { place_id: placeId, actor: getActor(user), characteristic, answer: 'skip' });
  };

  return { containerRef, questions, hasMoreQuestions, showMoreQuestions, answerYes, skip, error };
};
