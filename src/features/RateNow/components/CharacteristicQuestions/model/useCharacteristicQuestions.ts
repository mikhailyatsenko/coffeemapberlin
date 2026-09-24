import { useEffect, useRef, useState } from 'react';
import { useToggleCharacteristic } from 'shared/api';
import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';

import { getActor } from '../../../lib/getActor';
import { getSaveErrorMessage } from '../../../lib/getSaveErrorMessage';
import { trackContributionFailed } from '../../../lib/trackContributionFailed';
import { QUESTION_BATCH_SIZE, QUESTIONS } from '../constants/questions';

/**
 * The Yes / Skip questions: the opinion Characteristics not yet marked, a batch at a
 * time. A Yes marks the Characteristic through the optimistic toggle; a failed Yes
 * brings its question back with a message. A Skip is remembered for this page view only.
 */
export const useCharacteristicQuestions = (placeId: string, characteristicCounts: CharacteristicCounts) => {
  const user = useAuthStore((s) => s.user);
  const { toggleChar } = useToggleCharacteristic(placeId);
  const [skipped, setSkipped] = useState<Characteristic[]>([]);
  // Yes taps still saving; their questions leave at once, before the optimistic toggle lands.
  const [saving, setSaving] = useState<Characteristic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Set by an answer, so the questions never take focus on their own.
  const shouldMoveFocusRef = useRef(false);

  const remaining = QUESTIONS.filter(
    ({ characteristic }) =>
      !characteristicCounts[characteristic].pressed &&
      !skipped.includes(characteristic) &&
      !saving.includes(characteristic),
  );

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
    setSaving((current) => [...current, characteristic]);
    const actor = getActor(user);
    try {
      await toggleChar(characteristic);
      setError(null);
      trackEvent('characteristic_answered', { place_id: placeId, actor, characteristic, answer: 'yes' });
    } catch (saveError) {
      // Its question comes back: it is still in the batch, or in a later one if "More questions?" was used meanwhile.
      setError(getSaveErrorMessage(saveError));
      trackContributionFailed(placeId, actor, 'characteristic', saveError);
    } finally {
      setSaving((current) => current.filter((c) => c !== characteristic));
    }
  };

  const skip = (characteristic: Characteristic) => {
    shouldMoveFocusRef.current = true;
    setSkipped((current) => [...current, characteristic]);
    setError(null);
    trackEvent('characteristic_answered', { place_id: placeId, actor: getActor(user), characteristic, answer: 'skip' });
  };

  return { containerRef, questions, hasMoreQuestions, showMoreQuestions, answerYes, skip, error };
};
