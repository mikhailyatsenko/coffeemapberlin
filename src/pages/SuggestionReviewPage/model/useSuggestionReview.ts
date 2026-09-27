import { useState } from 'react';
import {
  PlaceSuggestionStatus,
  usePlaceSuggestionForReviewQuery,
  usePublishPlaceSuggestionMutation,
  useRejectPlaceSuggestionMutation,
} from 'shared/generated/graphql';
import { existingPlaceIdOf, isDuplicateGooglePlaceIdError, isInvalidLinkError } from '../lib/reviewErrors';
import { toPublishInput } from '../lib/toPublishInput';
import { type PublishError, type PublishFormValues, type SuggestionOutcome } from '../types';

/**
 * Loads one Place suggestion for the admin by its signed link and publishes or
 * rejects it. Opening the page only reads; the mutations run on a button press
 * (ADR 0002).
 */
export const useSuggestionReview = (id: string, token: string | null) => {
  const variables = { id, token: token ?? '' };
  const { data, loading, error } = usePlaceSuggestionForReviewQuery({
    variables,
    skip: !token,
    fetchPolicy: 'network-only',
  });
  const [publishPlaceSuggestion, { loading: isPublishing }] = usePublishPlaceSuggestionMutation();
  const [rejectPlaceSuggestion, { loading: isRejecting }] = useRejectPlaceSuggestionMutation();
  const [decidedOutcome, setDecidedOutcome] = useState<SuggestionOutcome | null>(null);
  const [publishError, setPublishError] = useState<PublishError | null>(null);
  const [rejectFailed, setRejectFailed] = useState(false);
  const [linkRejected, setLinkRejected] = useState(false);

  const suggestion = data?.placeSuggestionForReview ?? null;

  const publish = async (values: PublishFormValues) => {
    setPublishError(null);
    try {
      const result = await publishPlaceSuggestion({ variables: { ...variables, input: toPublishInput(values) } });
      if (result.data) setDecidedOutcome(result.data.publishPlaceSuggestion);
    } catch (publishFailure) {
      if (isInvalidLinkError(publishFailure)) setLinkRejected(true);
      else if (isDuplicateGooglePlaceIdError(publishFailure)) {
        setPublishError({
          kind: 'duplicate',
          googlePlaceId: values.googlePlaceId,
          existingPlaceId: existingPlaceIdOf(publishFailure),
        });
      } else setPublishError({ kind: 'failed' });
    }
  };

  const reject = async () => {
    setRejectFailed(false);
    try {
      const result = await rejectPlaceSuggestion({ variables });
      if (result.data) setDecidedOutcome(result.data.rejectPlaceSuggestion);
    } catch (rejectFailure) {
      if (isInvalidLinkError(rejectFailure)) setLinkRejected(true);
      else setRejectFailed(true);
    }
  };

  const loadedOutcome: SuggestionOutcome | null =
    suggestion && suggestion.status !== PlaceSuggestionStatus.pending ? suggestion : null;

  return {
    isLoading: loading,
    isInvalidLink: !token || linkRejected || isInvalidLinkError(error),
    loadFailed: Boolean(error) && !isInvalidLinkError(error),
    suggestion,
    outcome: decidedOutcome ?? loadedOutcome,
    publish,
    publishError,
    reject,
    // One decision at a time: while one is on its way, the other button waits.
    isDeciding: isPublishing || isRejecting,
    isRejecting,
    rejectFailed,
  };
};
