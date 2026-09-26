import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { useToggleCharacteristic } from 'shared/api';
import { type Characteristic } from 'shared/generated/graphql';
import { getSaveErrorMessage, getSaveErrorReason } from 'shared/lib/saveError';
import { useAuthStore } from 'shared/stores/auth';

import { QUESTION_TEXT } from '../constants/questions';
import { getActor } from '../lib/getActor';
import { trackCharacteristicAnswered } from '../lib/trackCharacteristicAnswered';
import { trackContributionFailed } from '../lib/trackContributionFailed';
import { type CardContributionProps, type SurfaceParams } from '../types';

/**
 * A card's one Yes / Skip question, asked once the person has a Rating and only
 * while the Characteristic isn't marked. A confirmed Yes goes into the Place's
 * cached `ownCharacteristics`, so no card of the Place asks it again; a failed
 * Yes brings the question back with a message. A Skip hides it on this card for
 * the page view.
 */
export const useCardQuestion = ({
  placeId,
  ownCharacteristics,
  question,
  hasRating,
  surfaceParams,
  onAnswer,
}: Pick<CardContributionProps, 'placeId' | 'ownCharacteristics' | 'question'> & {
  hasRating: boolean;
  surfaceParams: SurfaceParams;
  /** Called as an answer hides the question, so focus can move off it. */
  onAnswer: () => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const { cache } = useApolloClient();
  const { toggleChar } = useToggleCharacteristic(placeId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMarked = (characteristic: Characteristic) => ownCharacteristics?.includes(characteristic) ?? false;
  const askedCharacteristic = question && hasRating && !isMarked(question) && !isSkipped && !isSaving ? question : null;

  const answerYes = async () => {
    // Only ever marks: the toggle would un-mark a Characteristic that is already marked.
    if (!question || isMarked(question) || isSaving) return;
    const actor = getActor(user);
    setIsSaving(true);
    onAnswer();
    try {
      await toggleChar(question);
      cache.modify({
        id: cache.identify({ __typename: 'PlaceProperties', id: placeId }),
        fields: {
          // Null until the person marks one.
          ownCharacteristics: (current) => [...(Array.isArray(current) ? current : []), question],
        },
      });
      setError(null);
      trackCharacteristicAnswered(placeId, actor, surfaceParams, { characteristic: question, answer: 'yes' });
    } catch (saveError) {
      setError(getSaveErrorMessage(saveError));
      trackContributionFailed(placeId, actor, surfaceParams, {
        kind: 'characteristic',
        reason: getSaveErrorReason(saveError),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const skip = () => {
    if (!question) return;
    setIsSkipped(true);
    onAnswer();
    setError(null);
    trackCharacteristicAnswered(placeId, getActor(user), surfaceParams, { characteristic: question, answer: 'skip' });
  };

  return { questionText: askedCharacteristic && QUESTION_TEXT[askedCharacteristic], answerYes, skip, error };
};
