import { useFindGoogleIdsForSuggestionLazyQuery } from 'shared/generated/graphql';
import { type GoogleIdLookup } from '../types';

/**
 * Asks the server for Google Place ID candidates only when `find` is called;
 * each press asks again. While asking, or after a failure, there are no
 * candidates, so an earlier answer can't show or block Publish.
 */
export const useGoogleIdLookup = (id: string, token: string | null): GoogleIdLookup => {
  const [findGoogleIds, { data, loading, error }] = useFindGoogleIdsForSuggestionLazyQuery({
    fetchPolicy: 'network-only',
  });

  return {
    find: () => {
      // The error lands in `error`; the promise has nothing more to report.
      findGoogleIds({ variables: { id, token: token ?? '' } }).catch(() => {});
    },
    candidates:
      loading || error
        ? null
        : data?.findGoogleIdsForSuggestion.map(({ googleId, existingPlaceId }) => ({
            googleId,
            existingPlaceId: existingPlaceId ?? null,
          })) ?? null,
    isFinding: loading,
    findFailed: Boolean(error),
  };
};
