import { type ApolloClient, useApolloClient } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlaceDocument, type PlaceQuery, PlaceReviewsDocument, type PlaceReviewsQuery } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { setUser } from 'shared/stores/auth';
import { DetailedPlace } from './DetailedPlace';

vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));

const unmarked = { __typename: 'CharacteristicData', pressed: false, count: 0 } as const;

const place = (placeId: string, name: string): PlaceQuery =>
  ({
    __typename: 'Query',
    place: {
      __typename: 'Place',
      id: placeId,
      geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
      properties: {
        __typename: 'PlaceProperties',
        id: placeId,
        name,
        description: '',
        address: '',
        images: [],
        instagram: null,
        averageRating: 0,
        isFavorite: false,
        neighborhood: '',
        ratingCount: 0,
        googleId: null,
        openingHours: [],
        additionalInfo: null,
        phone: null,
        website: null,
        characteristicCounts: {
          __typename: 'CharacteristicCounts',
          deliciousFilterCoffee: unmarked,
          pleasantAtmosphere: unmarked,
          friendlyStaff: unmarked,
          freeWifi: unmarked,
          yummyEats: unmarked,
          affordablePrices: unmarked,
          petFriendly: unmarked,
          outdoorSeating: unmarked,
        },
      },
    },
  }) as unknown as PlaceQuery;

const reviews = (placeId: string, ownRating?: number): PlaceReviewsQuery => ({
  __typename: 'Query',
  placeReviews: {
    __typename: 'PlaceReviews',
    id: placeId,
    reviews: ownRating
      ? [
          {
            __typename: 'Review',
            id: `review-${placeId}`,
            text: null,
            userId: 'guest-1',
            userName: 'Guest',
            userAvatar: null,
            createdAt: '2026-09-01T00:00:00.000Z',
            userRating: ownRating,
            characteristics: [],
            isOwnReview: true,
            reviewImages: 0,
            isGoogleReview: false,
          },
        ]
      : [],
  },
});

const placeMock = (placeId: string, name: string): MockedResponse => ({
  request: { query: PlaceDocument, variables: { placeId } },
  result: { data: place(placeId, name) },
});

const reviewsMock = (
  placeId: string,
  { ownRating, delay = 0 }: { ownRating?: number; delay?: number } = {},
): MockedResponse => ({
  request: { query: PlaceReviewsDocument, variables: { placeId } },
  delay,
  result: { data: reviews(placeId, ownRating) },
});

const failingReviewsMock = (placeId: string): MockedResponse => ({
  request: { query: PlaceReviewsDocument, variables: { placeId } },
  error: new Error('Network down'),
});

/** A stand-in for the browser's viewport check: the test says when the block becomes visible. */
let reportVisibility: (isIntersecting: boolean) => void = () => {};

class FakeIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    reportVisibility = (isIntersecting) => {
      const entry: Partial<IntersectionObserverEntry> = { isIntersecting };
      callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
    };
  }

  observe() {}

  unobserve() {}

  disconnect() {
    reportVisibility = () => {};
  }
}

let apolloClient: ApolloClient<object>;

const CaptureClient = () => {
  apolloClient = useApolloClient();
  return null;
};

const renderPlacePage = (mocks: MockedResponse[], placeId: string) => {
  const page = (id: string) => (
    <MockedProvider mocks={mocks}>
      <MemoryRouter>
        <CaptureClient />
        <DetailedPlace placeId={id} />
      </MemoryRouter>
    </MockedProvider>
  );
  const view = render(page(placeId));
  // The Place page stays mounted on in-app navigation; only its placeId changes.
  const navigateTo = (id: string) => {
    view.rerender(page(id));
  };
  return { navigateTo };
};

const changeButton = () => screen.queryByRole('button', { name: 'change' });

/** The block in its "Your rating: N · change" state. */
const ratedBlock = async () => (await screen.findByRole('button', { name: 'change' })).closest('section');

const beansHeading = () => screen.queryByRole('heading', { name: 'Been here? Rate it' });

const findBeansHeading = async () => await screen.findByRole('heading', { name: 'Been here? Rate it' });

const trackedEvents = (name: string) => vi.mocked(trackEvent).mock.calls.filter(([eventName]) => eventName === name);

describe('DetailedPlace rate block', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    setUser(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(trackEvent).mockClear();
  });

  it('waits for the next Place’s own Review and opens with its Rating', async () => {
    const { navigateTo } = renderPlacePage(
      [
        placeMock('a', 'Bonanza'),
        reviewsMock('a'),
        placeMock('b', 'Five Elephant'),
        reviewsMock('b', { ownRating: 4, delay: 50 }),
      ],
      'a',
    );
    expect(await findBeansHeading()).toBeInTheDocument();

    navigateTo('b');
    await screen.findByText('Five Elephant');

    expect(changeButton()).not.toBeInTheDocument();
    expect(beansHeading()).not.toBeInTheDocument();

    expect(await ratedBlock()).toHaveTextContent('Your rating: 4');
    // Opened straight in the rated state, not the beans first.
    expect(beansHeading()).not.toBeInTheDocument();
    act(() => {
      reportVisibility(true);
    });
    expect(trackedEvents('rate_block_view')).toEqual([
      ['rate_block_view', { place_id: 'b', actor: 'guest', has_rating: true }],
    ]);
  });

  it('keeps the same block through a refetch of the Place’s Reviews', async () => {
    renderPlacePage(
      [
        placeMock('a', 'Bonanza'),
        reviewsMock('a', { ownRating: 3 }),
        placeMock('a', 'Bonanza'),
        reviewsMock('a', { ownRating: 3, delay: 50 }),
      ],
      'a',
    );
    const block = await ratedBlock();
    act(() => {
      reportVisibility(true);
    });

    // What signing in does. Apollo keeps the Reviews on screen while it refetches, so this guards the page as a whole;
    // the latch for a refetch that drops them is covered in useShowsRateBlock.test.ts.
    await act(async () => {
      await apolloClient.resetStore();
    });

    expect(await ratedBlock()).toBe(block);
    expect(trackedEvents('rate_block_view')).toHaveLength(1);
  });

  it('still shows the block when the next Place’s Reviews fail to load', async () => {
    const { navigateTo } = renderPlacePage(
      [placeMock('a', 'Bonanza'), reviewsMock('a'), placeMock('b', 'Five Elephant'), failingReviewsMock('b')],
      'a',
    );
    await findBeansHeading();

    navigateTo('b');

    expect(await screen.findByText('Five Elephant')).toBeInTheDocument();
    expect(await findBeansHeading()).toBeInTheDocument();
  });
});
