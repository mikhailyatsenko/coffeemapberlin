import { useEffect, useRef, useState } from 'react';
import { useSubmitPlaceSuggestionMutation } from 'shared/generated/graphql';
import { contributionCredentials } from 'shared/lib/guest';
import { usePhotoUpload, type UploadTarget } from 'shared/lib/photoUpload';
import { useAuthStore } from 'shared/stores/auth';
import { getSubmitErrorMessage } from '../lib/getSubmitErrorMessage';
import { toSuggestionInput } from '../lib/toSuggestionInput';
import { type SubmittedSuggestion, type Suggester, type SuggestPlaceFormValues } from '../types';

/**
 * Sends a Place suggestion as the signed-in User, or as a Guest — getting the
 * Guest identity first when this browser has none. Once the suggestion exists,
 * its picked photos upload one by one; a failed one can be sent again.
 */
export const useSubmitPlaceSuggestion = () => {
  const isSignedIn = useAuthStore((s) => Boolean(s.user));
  const isAuthLoading = useAuthStore((s) => s.isAuthLoading);
  const [submitPlaceSuggestion] = useSubmitPlaceSuggestionMutation();
  // A new suggestion has no photos yet, so all 10 are free.
  const photoUpload = usePhotoUpload(0);
  const { uploadPending, uploadPhotos } = photoUpload;
  const [submitted, setSubmitted] = useState<SubmittedSuggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Where the photos go, known once the suggestion is created; retries reuse it.
  const uploadTargetRef = useRef<UploadTarget | null>(null);
  // Aborted on unmount, so leaving the page stops the upload. Created in the effect to survive StrictMode's remount.
  const abortRef = useRef<AbortController | null>(null);

  const submit = async (values: SuggestPlaceFormValues) => {
    setErrorMessage(null);
    try {
      const credentials = await contributionCredentials(isSignedIn);
      const result = await submitPlaceSuggestion({
        variables: { input: toSuggestionInput(values, isSignedIn), ...credentials },
      });
      setSubmitted({ willEmail: isSignedIn || Boolean(values.email) });

      const suggestionId = result.data?.submitPlaceSuggestion;
      if (!suggestionId) return;
      uploadTargetRef.current = {
        suggestionId,
        guestCredentials: credentials,
        signal: abortRef.current?.signal,
      };
      // The suggestion is in; each photo reports its own outcome on the thank-you.
      void uploadPending(uploadTargetRef.current);
    } catch (error) {
      setErrorMessage(getSubmitErrorMessage(error));
    }
  };

  const retryPhoto = (photoId: string) => {
    if (uploadTargetRef.current) void uploadPhotos([photoId], uploadTargetRef.current);
  };

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    return () => {
      controller.abort();
    };
  }, []);

  const suggester: Suggester = isSignedIn ? 'user' : isAuthLoading ? 'unknown' : 'guest';

  return { suggester, submit, submitted, errorMessage, photoUpload, retryPhoto };
};
