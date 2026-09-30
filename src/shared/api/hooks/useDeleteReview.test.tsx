import { InMemoryCache } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DeleteReviewDocument,
  PlaceReviewsDocument,
  type DeleteReviewMutationVariables,
  type PlaceReviewsQuery,
} from 'shared/generated/graphql';
import { clearGuestIdentity, writeGuestIdentity } from 'shared/lib/guest';
import { setUser } from 'shared/stores/auth';
import { ModalContentVariant } from 'shared/stores/modal/constants';
import { useModalStore } from 'shared/stores/modal/hooks';
import { useDeleteReview } from './useDeleteReview';

const placeId = 'place-1';
const reviewId = 'review-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

// The Places-list cache update (averageRating/ratingCount) runs the same, unchanged
// code for a Guest as for a User, so it is out of scope here; only the Review list
// update, which this ticket's acceptance criteria call out, is asserted below.
const seededCache = () => {
  const cache = new InMemoryCache();

  cache.writeQuery({
    query: PlaceReviewsDocument,
    variables: { placeId },
    data: {
      placeReviews: {
        __typename: 'PlaceReviews',
        id: placeId,
        reviews: [
          {
            __typename: 'Review',
            id: reviewId,
            text: 'Great coffee',
            userId: null,
            userName: 'A Guest',
            userAvatar: null,
            createdAt: new Date().toISOString(),
            userRating: 4,
            characteristics: null,
            isOwnReview: true,
            reviewImages: 0,
            isGoogleReview: false,
          },
        ],
      },
    },
  });

  return cache;
};

const deleteReviewMock = (variables: DeleteReviewMutationVariables): MockedResponse => ({
  request: { query: DeleteReviewDocument, variables },
  result: {
    data: {
      deleteReview: { __typename: 'DeleteReviewResult', reviewId, averageRating: 3, ratingCount: 2 },
    },
  },
});

const renderUseDeleteReview = (mocks: MockedResponse[], cache: InMemoryCache) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MockedProvider mocks={mocks} cache={cache}>
      {children}
    </MockedProvider>
  );
  return renderHook(() => useDeleteReview(placeId), { wrapper });
};

describe('useDeleteReview', () => {
  beforeEach(() => {
    setUser(null);
    clearGuestIdentity();
    useModalStore.setState({ modalContentVariant: ModalContentVariant.Hidden });
  });

  afterEach(() => {
    setUser(null);
    clearGuestIdentity();
  });

  it('sends deleteReview for a Guest with a stored identity, without a login prompt', async () => {
    writeGuestIdentity(guest);
    const cache = seededCache();
    const { result } = renderUseDeleteReview([deleteReviewMock({ reviewId, deleteOptions: 'deleteAll' })], cache);

    await result.current.handleDeleteReview(reviewId, 'deleteAll');

    await waitFor(() => {
      expect(
        cache.readQuery<PlaceReviewsQuery>({ query: PlaceReviewsDocument, variables: { placeId } })?.placeReviews
          .reviews,
      ).toEqual([]);
    });
    expect(useModalStore.getState().modalContentVariant).toBe(ModalContentVariant.Hidden);
  });

  it('lets a Guest delete only the Review text, keeping the Rating', async () => {
    writeGuestIdentity(guest);
    const cache = seededCache();
    const { result } = renderUseDeleteReview(
      [deleteReviewMock({ reviewId, deleteOptions: 'deleteReviewText' })],
      cache,
    );

    await result.current.handleDeleteReview(reviewId, 'deleteReviewText');

    await waitFor(() => {
      expect(
        cache.readQuery<PlaceReviewsQuery>({ query: PlaceReviewsDocument, variables: { placeId } })?.placeReviews
          .reviews,
      ).toEqual([expect.objectContaining({ text: '', userRating: 4 })]);
    });
    expect(useModalStore.getState().modalContentVariant).toBe(ModalContentVariant.Hidden);
  });

  it('lets a Guest delete only the Rating, keeping the Review text', async () => {
    writeGuestIdentity(guest);
    const cache = seededCache();
    const { result } = renderUseDeleteReview([deleteReviewMock({ reviewId, deleteOptions: 'deleteRating' })], cache);

    await result.current.handleDeleteReview(reviewId, 'deleteRating');

    await waitFor(() => {
      expect(
        cache.readQuery<PlaceReviewsQuery>({ query: PlaceReviewsDocument, variables: { placeId } })?.placeReviews
          .reviews,
      ).toEqual([expect.objectContaining({ text: 'Great coffee', userRating: null })]);
    });
    expect(useModalStore.getState().modalContentVariant).toBe(ModalContentVariant.Hidden);
  });

  it('shows the login prompt and sends nothing when there is no User and no Guest identity', async () => {
    const cache = seededCache();
    const { result } = renderUseDeleteReview([], cache);

    await result.current.handleDeleteReview(reviewId, 'deleteAll');

    expect(useModalStore.getState().modalContentVariant).toBe(ModalContentVariant.LoginRequired);
    expect(
      cache.readQuery<PlaceReviewsQuery>({ query: PlaceReviewsDocument, variables: { placeId } })?.placeReviews.reviews,
    ).toHaveLength(1);
  });
});
