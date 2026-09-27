import { useState } from 'react';
import { useSubmitPlaceSuggestionMutation } from 'shared/generated/graphql';
import { contributionCredentials } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';
import { getSubmitErrorMessage } from '../lib/getSubmitErrorMessage';
import { toSuggestionInput } from '../lib/toSuggestionInput';
import { type SubmittedSuggestion, type Suggester, type SuggestPlaceFormValues } from '../types';

/**
 * Sends a Place suggestion as the signed-in User, or as a Guest — getting the
 * Guest identity first when this browser has none.
 */
export const useSubmitPlaceSuggestion = () => {
  const isSignedIn = useAuthStore((s) => Boolean(s.user));
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const [submitPlaceSuggestion] = useSubmitPlaceSuggestionMutation();
  const [submitted, setSubmitted] = useState<SubmittedSuggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (values: SuggestPlaceFormValues) => {
    setErrorMessage(null);
    try {
      const credentials = await contributionCredentials(isSignedIn);
      await submitPlaceSuggestion({ variables: { input: toSuggestionInput(values, isSignedIn), ...credentials } });
      setSubmitted({ willEmail: isSignedIn || Boolean(values.email) });
    } catch (error) {
      setErrorMessage(getSubmitErrorMessage(error));
    }
  };

  const suggester: Suggester = isSignedIn ? 'user' : isAuthLoading ? 'unknown' : 'guest';

  return { suggester, submit, submitted, errorMessage };
};
