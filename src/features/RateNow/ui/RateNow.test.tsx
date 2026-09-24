import { InMemoryCache } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AddRatingDocument,
  Characteristic,
  PlaceDocument,
  type PlaceQuery,
  PlaceReviewsDocument,
  ToggleCharacteristicDocument,
  usePlaceQuery,
} from 'shared/generated/graphql';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { RateNow } from './RateNow';

vi.mock('shared/lib/guest', () => ({ ensureGuestIdentity: vi.fn() }));
vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('shared/stores/places', () => ({ revalidatePlaces: vi.fn() }));

const placeId = 'place-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

const unpressed = { __typename: 'CharacteristicData', pressed: false, count: 0 } as const;

const place: PlaceQuery = {
  __typename: 'Query',
  place: {
    __typename: 'Place',
    id: placeId,
    geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
    properties: {
      __typename: 'PlaceProperties',
      id: placeId,
      name: 'Bonanza',
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
        deliciousFilterCoffee: unpressed,
        pleasantAtmosphere: unpressed,
        friendlyStaff: unpressed,
        freeWifi: unpressed,
        yummyEats: unpressed,
        affordablePrices: unpressed,
        petFriendly: unpressed,
        outdoorSeating: unpressed,
      },
    },
  },
} as unknown as PlaceQuery;

/** Reads the Place from the cache, as DetailedPlace does, so optimistic toggles show up in the chips. */
const Harness = () => {
  const [showRateNow, setShowRateNow] = useState(true);
  const { data } = usePlaceQuery({ variables: { placeId }, fetchPolicy: 'cache-only' });
  if (!data?.place) return null;

  return (
    <RateNow
      placeId={placeId}
      reviews={[]}
      characteristicCounts={data.place.properties.characteristicCounts}
      showRateNow={showRateNow}
      setShowRateNow={setShowRateNow}
    />
  );
};

const renderRateNow = (mocks: MockedResponse[] = []) => {
  const cache = new InMemoryCache();
  cache.writeQuery({ query: PlaceDocument, variables: { placeId }, data: place });
  return render(
    <MockedProvider mocks={mocks} cache={cache}>
      <Harness />
    </MockedProvider>,
  );
};

const bean = (rating: number) => screen.getByRole('radio', { name: `${rating} of 5` });

const freeWifiChip = () => screen.getByRole('button', { name: /wi-fi/i });

describe('RateNow Characteristic failures', () => {
  let unhandled: unknown[];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };

  beforeEach(() => {
    unhandled = [];
    process.on('unhandledRejection', onUnhandled);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
  });

  afterEach(() => {
    process.off('unhandledRejection', onUnhandled);
    vi.restoreAllMocks();
  });

  it('shows an error and releases the chip when a Characteristic fails to save', async () => {
    renderRateNow([
      {
        request: {
          query: ToggleCharacteristicDocument,
          variables: { placeId, characteristic: Characteristic.freeWifi, ...guest },
        },
        delay: 50,
        error: new Error('Network down'),
      },
    ]);

    fireEvent.click(freeWifiChip());

    // Pressed optimistically while the request is in flight...
    await waitFor(() => {
      expect(freeWifiChip()).toHaveClass('pressed');
    });
    // ...and released once it fails.
    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't save/i);
    expect(freeWifiChip()).not.toHaveClass('pressed');
    expect(unhandled).toEqual([]);
  });

  it('tells a Guest that verification was blocked when reCAPTCHA fails on a Characteristic', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    renderRateNow();

    fireEvent.click(freeWifiChip());

    expect(await screen.findByRole('alert')).toHaveTextContent(/ad blocker/i);
    expect(freeWifiChip()).not.toHaveClass('pressed');
    expect(unhandled).toEqual([]);
  });

  it('clears the error on the next successful attempt', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValueOnce(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    renderRateNow([
      {
        request: {
          query: ToggleCharacteristicDocument,
          variables: { placeId, characteristic: Characteristic.freeWifi, ...guest },
        },
        result: { data: { toggleCharacteristic: { __typename: 'ToggleCharacteristicResult', success: true } } },
      },
    ]);

    fireEvent.click(freeWifiChip());
    await screen.findByRole('alert');

    fireEvent.click(freeWifiChip());

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});

const addRatingMock = ({
  onCall = () => {},
  delay = 0,
}: { onCall?: () => void; delay?: number } = {}): MockedResponse => ({
  request: { query: AddRatingDocument, variables: { placeId, rating: 4, ...guest } },
  delay,
  result: () => {
    onCall();
    return {
      data: {
        addRating: {
          __typename: 'AddRatingResult',
          averageRating: 4,
          ratingCount: 1,
          reviewId: 'review-1',
          userRating: 4,
        },
      },
    };
  },
});

const refetchMocks: MockedResponse[] = [
  { request: { query: PlaceDocument, variables: { placeId } }, result: { data: place } },
  {
    request: { query: PlaceReviewsDocument, variables: { placeId } },
    result: { data: { placeReviews: { __typename: 'PlaceReviews', id: placeId, reviews: [] } } },
  },
];

describe('RateNow Rating in the modal', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the tapped Rating at once and thanks the Guest once it is saved', async () => {
    const addRating = vi.fn();
    renderRateNow([addRatingMock({ onCall: addRating, delay: 50 }), ...refetchMocks]);

    fireEvent.click(bean(4));

    expect(bean(4)).toBeChecked();
    expect(addRating).not.toHaveBeenCalled();
    expect(screen.getByText('What made your visit special?')).toBeInTheDocument();

    const confirmation = await screen.findByRole('status');
    expect(confirmation).toHaveTextContent(/thank/i);
    expect(confirmation).toHaveTextContent(/below/i);
    expect(addRating).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('rolls the Rating back and explains a failed save', async () => {
    renderRateNow([
      {
        request: { query: AddRatingDocument, variables: { placeId, rating: 4, ...guest } },
        error: new Error('Network down'),
      },
    ]);

    fireEvent.click(bean(4));

    expect(await screen.findByRole('alert')).toHaveTextContent(/couldn't save/i);
    expect(bean(4)).not.toBeChecked();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
