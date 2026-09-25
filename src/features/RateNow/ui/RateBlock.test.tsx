import { InMemoryCache } from '@apollo/client';
import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GraphQLError } from 'graphql';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AddRatingDocument,
  Characteristic,
  PlaceDocument,
  type PlaceQuery,
  PlaceReviewsDocument,
  ToggleCharacteristicDocument,
  UploadReviewImageDocument,
  usePlaceQuery,
  usePlaceReviewsQuery,
} from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { resizeAndConvert } from 'shared/lib/image';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { setUser } from 'shared/stores/auth';
import { useModalStore } from 'shared/stores/modal';
import { RateBlock, type RateBlockHandle } from './RateBlock';
import { RateButton } from './RateButton';

vi.mock('shared/lib/guest', () => ({ ensureGuestIdentity: vi.fn() }));
vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('shared/stores/places', () => ({ revalidatePlaces: vi.fn() }));
// jsdom has no createImageBitmap or canvas, so the downscale is replaced by a stand-in.
vi.mock('shared/lib/image', () => ({ resizeAndConvert: vi.fn() }));

const placeId = 'place-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

/**
 * How long a mock stays unanswered in tests that check the state while a save is in flight.
 * Long enough that a loaded machine still sees that state, short of the 1000 ms findBy / waitFor timeout.
 */
const IN_FLIGHT_MS = 300;

const unmarked = { __typename: 'CharacteristicData', pressed: false, count: 0 } as const;
const marked = { __typename: 'CharacteristicData', pressed: true, count: 1 } as const;

const placeWith = (markedCharacteristics: Characteristic[] = []): PlaceQuery => {
  const characteristicData = (characteristic: Characteristic) =>
    markedCharacteristics.includes(characteristic) ? marked : unmarked;
  return {
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
          deliciousFilterCoffee: characteristicData(Characteristic.deliciousFilterCoffee),
          pleasantAtmosphere: characteristicData(Characteristic.pleasantAtmosphere),
          friendlyStaff: characteristicData(Characteristic.friendlyStaff),
          freeWifi: characteristicData(Characteristic.freeWifi),
          yummyEats: characteristicData(Characteristic.yummyEats),
          affordablePrices: characteristicData(Characteristic.affordablePrices),
          petFriendly: characteristicData(Characteristic.petFriendly),
          outdoorSeating: characteristicData(Characteristic.outdoorSeating),
        },
      },
    },
  } as unknown as PlaceQuery;
};

const addRatingMock = ({
  rating = 4,
  onCall = () => {},
  delay = 0,
}: { rating?: number; onCall?: () => void; delay?: number } = {}): MockedResponse => ({
  request: { query: AddRatingDocument, variables: { placeId, rating, ...guest } },
  delay,
  result: () => {
    onCall();
    return {
      data: {
        addRating: {
          __typename: 'AddRatingResult',
          averageRating: rating,
          ratingCount: 1,
          reviewId: 'review-1',
          userRating: rating,
        },
      },
    };
  },
});

const refetchMocks = (): MockedResponse[] => [
  { request: { query: PlaceDocument, variables: { placeId } }, result: { data: placeWith() } },
  {
    request: { query: PlaceReviewsDocument, variables: { placeId } },
    result: { data: { placeReviews: { __typename: 'PlaceReviews', id: placeId, reviews: [] } } },
  },
];

const DOWNSCALED_BASE64 = btoa('downscaled');

/** One answered `uploadReviewImage` for the Review; `onCall` counts what reached the network. */
const uploadMock = ({
  reviewId = 'review-1',
  onCall = () => {},
  delay = 0,
}: { reviewId?: string; onCall?: () => void; delay?: number } = {}): MockedResponse => ({
  request: { query: UploadReviewImageDocument, variables: { reviewId, fileBuffer: DOWNSCALED_BASE64, ...guest } },
  delay,
  result: () => {
    onCall();
    return { data: { uploadReviewImage: { __typename: 'UploadReviewImageResponse', reviewImages: 1 } } };
  },
});

/** One `uploadReviewImage` for the Review that fails with the server's `code`, or on the network without one. */
const failedUploadMock = ({
  reviewId = 'own-review',
  code,
}: { reviewId?: string; code?: string } = {}): MockedResponse => ({
  request: { query: UploadReviewImageDocument, variables: { reviewId, fileBuffer: DOWNSCALED_BASE64, ...guest } },
  ...(code
    ? { result: { errors: [new GraphQLError('Upload failed', { extensions: { code } })] } }
    : { error: new Error('Network down') }),
});

/** The Place reviews with the person's own Review holding `ownPhotos` Photos. */
const placeReviewsMock = ({
  ownPhotos = 0,
  onCall = () => {},
}: { ownPhotos?: number; onCall?: () => void } = {}): MockedResponse => ({
  request: { query: PlaceReviewsDocument, variables: { placeId } },
  result: () => {
    onCall();
    return {
      data: {
        placeReviews: {
          __typename: 'PlaceReviews',
          id: placeId,
          reviews: [
            {
              __typename: 'Review',
              id: 'own-review',
              text: null,
              userId: null,
              userName: 'Guest',
              userAvatar: null,
              createdAt: '2026-09-25',
              userRating: 3,
              characteristics: [],
              isOwnReview: true,
              reviewImages: ownPhotos,
              isGoogleReview: false,
            },
          ],
        },
      },
    };
  },
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

const toggleCharacteristicMock = ({
  characteristic,
  onCall = () => {},
  delay = 0,
  fails = false,
}: {
  characteristic: Characteristic;
  onCall?: () => void;
  delay?: number;
  fails?: boolean;
}): MockedResponse => ({
  request: { query: ToggleCharacteristicDocument, variables: { placeId, characteristic, ...guest } },
  delay,
  ...(fails
    ? { error: new Error('Network down') }
    : {
        result: () => {
          onCall();
          return { data: { toggleCharacteristic: { __typename: 'ToggleCharacteristicResult', success: true } } };
        },
      }),
});

/** Reads the Place from the cache, as DetailedPlace does, so a Yes shows up in the Characteristic counts. */
const Harness = ({
  rating,
  hasReviewText,
  onAddReviewText,
  withRateButton,
  ownReviewId,
  ownReviewPhotoCount,
  watchesReviews,
}: {
  rating?: number | null;
  hasReviewText: boolean;
  onAddReviewText: () => void;
  withRateButton: boolean;
  ownReviewId?: string;
  ownReviewPhotoCount: number;
  watchesReviews: boolean;
}) => {
  const rateBlockRef = useRef<RateBlockHandle>(null);
  const { data } = usePlaceQuery({ variables: { placeId }, fetchPolicy: 'cache-only' });
  // The Place page's Reviews: a refetch after Photos reaches the network and updates the own Review's count.
  const { data: reviewsData, refetch: refetchReviews } = usePlaceReviewsQuery({
    variables: { placeId },
    skip: !watchesReviews,
  });
  const ownReview = reviewsData?.placeReviews.reviews.find((review) => review.isOwnReview);
  if (!data?.place) return null;
  const { characteristicCounts } = data.place.properties;

  return (
    <>
      {withRateButton && (
        <RateButton
          placeId={placeId}
          rating={rating}
          onClick={() => {
            rateBlockRef.current?.focusBeans();
          }}
        />
      )}
      <RateBlock
        ref={rateBlockRef}
        placeId={placeId}
        rating={rating}
        characteristicCounts={characteristicCounts}
        hasReviewText={hasReviewText}
        onAddReviewText={onAddReviewText}
        ownReviewId={ownReviewId}
        ownReviewPhotoCount={ownReview?.reviewImages ?? ownReviewPhotoCount}
      />
      {watchesReviews && (
        // Stands in for another part of the page, such as the Review text form, refetching the Reviews.
        <button
          type="button"
          onClick={() => {
            refetchReviews().catch(() => {});
          }}
        >
          Refetch reviews
        </button>
      )}
      <p>Friendly staff count: {characteristicCounts.friendlyStaff.count}</p>
    </>
  );
};

const renderRateBlock = (
  mocks: MockedResponse[],
  rating?: number | null,
  {
    markedCharacteristics = [],
    hasReviewText = false,
    onAddReviewText = () => {},
    withRateButton = false,
    ownReviewId,
    ownReviewPhotoCount = 0,
    watchesReviews = false,
  }: {
    markedCharacteristics?: Characteristic[];
    hasReviewText?: boolean;
    onAddReviewText?: () => void;
    withRateButton?: boolean;
    ownReviewId?: string;
    ownReviewPhotoCount?: number;
    watchesReviews?: boolean;
  } = {},
) => {
  const cache = new InMemoryCache();
  cache.writeQuery({ query: PlaceDocument, variables: { placeId }, data: placeWith(markedCharacteristics) });
  return render(
    <MockedProvider mocks={mocks} cache={cache}>
      <Harness
        rating={rating}
        hasReviewText={hasReviewText}
        onAddReviewText={onAddReviewText}
        withRateButton={withRateButton}
        ownReviewId={ownReviewId}
        ownReviewPhotoCount={ownReviewPhotoCount}
        watchesReviews={watchesReviews}
      />
    </MockedProvider>,
  );
};

const question = (text: string) => screen.getByRole('group', { name: text });

const askedQuestions = () => screen.queryAllByRole('group').map((group) => group.querySelector('legend')?.textContent);

const answer = (text: string, button: 'Yes' | 'Skip') => within(question(text)).getByRole('button', { name: button });

const bean = (rating: number) => screen.getByRole('radio', { name: `${rating} of 5` });

const marks = () => screen.queryByRole('list', { name: 'Your marks' });

const markNames = () =>
  within(screen.getByRole('list', { name: 'Your marks' }))
    .getAllByRole('button')
    .map((chip) => chip.getAttribute('aria-label'));

const reviewTextLink = () => screen.queryByRole('button', { name: 'Add a few words' });

/** The thank-you comes first; the Photo row below has its own status line. */
const thanks = () => screen.getAllByRole('status')[0];

const addPhotoButton = () => screen.queryByRole('button', { name: 'Add a photo' });

const photo = (name: string) => new File(['original'], name, { type: 'image/jpeg' });

const pickPhotos = async (user: ReturnType<typeof userEvent.setup>, files: File[]) => {
  await user.upload(screen.getByLabelText('Choose photos'), files);
};

/** The thumbnail of the picked file `name`, with its status, error and Retry. */
const thumbnailOf = (name: string) => screen.getByRole('img', { name: new RegExp(`: ${name}$`) }).closest('li')!;

const skipAll = async (user: ReturnType<typeof userEvent.setup>) => {
  for (const text of askedQuestions()) await user.click(answer(text!, 'Skip'));
};

const trackedEvents = (name: string) => vi.mocked(trackEvent).mock.calls.filter(([eventName]) => eventName === name);

describe('RateBlock', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
    vi.mocked(resizeAndConvert).mockResolvedValue(new Blob(['downscaled'], { type: 'image/webp' }));
    URL.createObjectURL = vi.fn(() => 'blob:photo');
    URL.revokeObjectURL = vi.fn();
    setUser(null);
  });

  afterEach(() => {
    // @ts-expect-error jsdom has no scrollIntoView; drop the stub a test may have put there.
    delete Element.prototype.scrollIntoView;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.mocked(trackEvent).mockClear();
    vi.mocked(ensureGuestIdentity).mockReset();
  });

  it('asks a person with no Rating to rate the Place', () => {
    renderRateBlock([]);

    expect(screen.getByRole('heading', { name: 'Been here? Rate it' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(thanks()).toBeEmptyDOMElement();
  });

  it('thanks the Guest and shows the Rating the moment a bean is tapped', async () => {
    const user = userEvent.setup();
    const addRating = vi.fn();
    renderRateBlock([addRatingMock({ onCall: addRating, delay: IN_FLIGHT_MS }), ...refetchMocks()]);

    await user.click(bean(4));

    expect(thanks()).toHaveTextContent('Thanks!');
    expect(thanks()).toHaveTextContent('Your rating: 4');
    // The tapped bean is gone, so focus moves to what replaced it.
    expect(screen.getByRole('button', { name: 'change' })).toHaveFocus();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(addRating).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(addRating).toHaveBeenCalledTimes(1);
    });
    expect(thanks()).toHaveTextContent('Your rating: 4');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('returns to the beans and explains a failed save', async () => {
    const user = userEvent.setup();
    renderRateBlock([
      { request: { query: AddRatingDocument, variables: { placeId, rating: 4, ...guest } }, error: new Error('down') },
    ]);

    await user.click(bean(4));

    expect(await screen.findByRole('alert')).toHaveTextContent(/check your connection/i);
    expect(bean(4)).not.toBeChecked();
    expect(screen.queryByText('Thanks!')).not.toBeInTheDocument();
    expect(screen.queryByText(/your rating/i)).not.toBeInTheDocument();
  });

  it('returns to the beans and explains a blocked reCAPTCHA', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const user = userEvent.setup();
    renderRateBlock([]);

    await user.click(bean(4));

    expect(await screen.findByRole('alert')).toHaveTextContent(/ad blocker/i);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  it('greets a returning person with their Rating and no thanks', () => {
    renderRateBlock([], 3);

    const summary = thanks();
    expect(summary).toHaveTextContent('Your rating: 3');
    expect(summary).not.toHaveTextContent('Thanks!');
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('shows the beans with the current Rating on "change" and saves the new one as a change', async () => {
    const user = userEvent.setup();
    renderRateBlock([addRatingMock({ rating: 5 }), ...refetchMocks()], 3);

    await user.click(screen.getByRole('button', { name: 'change' }));

    expect(bean(3)).toBeChecked();
    expect(bean(3)).toHaveFocus();
    await user.click(bean(5));

    expect(thanks()).toHaveTextContent('Your rating: 5');
    await waitFor(() => {
      expect(trackedEvents('rating_saved')).toEqual([
        ['rating_saved', { place_id: placeId, actor: 'guest', rating: 5, is_change: true }],
      ]);
    });
  });

  it('sends rate_block_view once, when the block first enters the viewport', () => {
    renderRateBlock([], 3);

    expect(trackedEvents('rate_block_view')).toEqual([]);
    act(() => {
      reportVisibility(false);
    });
    expect(trackedEvents('rate_block_view')).toEqual([]);

    act(() => {
      reportVisibility(true);
      reportVisibility(false);
      reportVisibility(true);
    });

    expect(trackedEvents('rate_block_view')).toEqual([
      ['rate_block_view', { place_id: placeId, actor: 'guest', has_rating: true }],
    ]);
  });

  it('reports a view without a Rating as has_rating: false', () => {
    renderRateBlock([]);

    act(() => {
      reportVisibility(true);
    });

    expect(trackedEvents('rate_block_view')).toEqual([
      ['rate_block_view', { place_id: placeId, actor: 'guest', has_rating: false }],
    ]);
  });

  it('asks no questions before a Rating and up to three once there is one', async () => {
    const user = userEvent.setup();
    renderRateBlock([addRatingMock(), ...refetchMocks()]);

    expect(askedQuestions()).toEqual([]);
    await user.click(bean(4));

    expect(askedQuestions()).toEqual(['Delicious filter coffee?', 'Pleasant atmosphere?', 'Yummy eats?']);
  });

  it('shows the rest on "More questions?" once the shown ones are answered, and never asks about Amenities', async () => {
    const user = userEvent.setup();
    renderRateBlock([], 4);

    expect(screen.queryByRole('button', { name: 'More questions?' })).not.toBeInTheDocument();
    await user.click(answer('Delicious filter coffee?', 'Skip'));
    await user.click(answer('Pleasant atmosphere?', 'Skip'));
    expect(screen.queryByRole('button', { name: 'More questions?' })).not.toBeInTheDocument();
    await user.click(answer('Yummy eats?', 'Skip'));
    await user.click(screen.getByRole('button', { name: 'More questions?' }));

    expect(askedQuestions()).toEqual(['Friendly staff?', 'Affordable prices?']);
    await user.click(answer('Friendly staff?', 'Skip'));
    await user.click(answer('Affordable prices?', 'Skip'));

    expect(askedQuestions()).toEqual([]);
    expect(screen.queryByRole('button', { name: 'More questions?' })).not.toBeInTheDocument();
    expect(screen.queryByText(/wi-fi|outdoor|pet/i)).not.toBeInTheDocument();
  });

  it('does not ask about Characteristics the person already marked', () => {
    renderRateBlock([], 4, {
      markedCharacteristics: [Characteristic.deliciousFilterCoffee, Characteristic.yummyEats],
    });

    expect(askedQuestions()).toEqual(['Pleasant atmosphere?', 'Friendly staff?', 'Affordable prices?']);
  });

  it('marks the Characteristic on Yes and does not ask again', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.friendlyStaff, onCall: toggle })], 4, {
      markedCharacteristics: [Characteristic.deliciousFilterCoffee, Characteristic.yummyEats],
    });
    expect(screen.getByText('Friendly staff count: 0')).toBeInTheDocument();

    await user.click(answer('Friendly staff?', 'Yes'));

    expect(askedQuestions()).toEqual(['Pleasant atmosphere?', 'Affordable prices?']);
    await waitFor(() => {
      expect(trackedEvents('characteristic_answered')).toEqual([
        [
          'characteristic_answered',
          { place_id: placeId, actor: 'guest', characteristic: 'friendlyStaff', answer: 'yes' },
        ],
      ]);
    });
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(askedQuestions()).toEqual(['Pleasant atmosphere?', 'Affordable prices?']);
    expect(screen.getByText('Friendly staff count: 1')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('sends nothing on Skip and does not ask again during this page view', async () => {
    const user = userEvent.setup();
    renderRateBlock([], 4);

    await user.click(answer('Pleasant atmosphere?', 'Skip'));

    expect(askedQuestions()).toEqual(['Delicious filter coffee?', 'Yummy eats?']);
    expect(trackedEvents('characteristic_answered')).toEqual([
      [
        'characteristic_answered',
        { place_id: placeId, actor: 'guest', characteristic: 'pleasantAtmosphere', answer: 'skip' },
      ],
    ]);
    expect(ensureGuestIdentity).not.toHaveBeenCalled();
  });

  it('brings a question back and explains a failed Yes', async () => {
    const user = userEvent.setup();
    renderRateBlock(
      [toggleCharacteristicMock({ characteristic: Characteristic.yummyEats, fails: true, delay: IN_FLIGHT_MS })],
      4,
    );

    await user.click(answer('Yummy eats?', 'Yes'));

    expect(askedQuestions()).toEqual(['Delicious filter coffee?', 'Pleasant atmosphere?']);
    expect(await screen.findByRole('alert')).toHaveTextContent(/check your connection/i);
    expect(askedQuestions()).toEqual(['Delicious filter coffee?', 'Pleasant atmosphere?', 'Yummy eats?']);
    expect(trackedEvents('contribution_failed')).toEqual([
      ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'characteristic', reason: 'network' }],
    ]);
    expect(trackedEvents('characteristic_answered')).toEqual([]);
  });

  it('explains a Yes blocked by reCAPTCHA', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const user = userEvent.setup();
    renderRateBlock([], 4);

    await user.click(answer('Yummy eats?', 'Yes'));

    expect(await screen.findByRole('alert')).toHaveTextContent(/ad blocker/i);
    expect(askedQuestions()).toContain('Yummy eats?');
    expect(trackedEvents('contribution_failed')).toEqual([
      ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'characteristic', reason: 'recaptcha' }],
    ]);
  });

  it('answers questions with Tab and Enter or Space', async () => {
    const user = userEvent.setup();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.deliciousFilterCoffee })], 4);

    await user.tab(); // "change"
    await user.tab();
    expect(answer('Delicious filter coffee?', 'Yes')).toHaveFocus();
    await user.keyboard('{Enter}');
    await waitFor(() => {
      expect(askedQuestions()).toEqual(['Pleasant atmosphere?', 'Yummy eats?']);
    });

    // The answered question is gone, so focus is on the next one.
    expect(answer('Pleasant atmosphere?', 'Yes')).toHaveFocus();
    await user.tab();
    expect(answer('Pleasant atmosphere?', 'Skip')).toHaveFocus();
    await user.keyboard(' ');
    expect(askedQuestions()).toEqual(['Yummy eats?']);
    expect(answer('Yummy eats?', 'Yes')).toHaveFocus();
  });

  it('clears the message on the next successful Yes', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValueOnce(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const user = userEvent.setup();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.yummyEats })], 4);

    await user.click(answer('Yummy eats?', 'Yes'));
    await screen.findByRole('alert');
    await user.click(answer('Yummy eats?', 'Yes'));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(askedQuestions()).not.toContain('Yummy eats?');
  });

  it('keeps a Skip for the page view even when the first Rating fails to save', async () => {
    let failIdentity: (error: Error) => void = () => {};
    vi.mocked(ensureGuestIdentity).mockReturnValueOnce(
      new Promise((_resolve, reject) => {
        failIdentity = reject;
      }),
    );
    const user = userEvent.setup();
    renderRateBlock([addRatingMock(), ...refetchMocks()]);

    await user.click(bean(4));
    await user.click(answer('Pleasant atmosphere?', 'Skip'));
    act(() => {
      failIdentity(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    });
    await screen.findByRole('alert');
    await user.click(bean(4));

    expect(askedQuestions()).toEqual(['Delicious filter coffee?', 'Yummy eats?']);
  });

  it('lists every marked Characteristic under "Your marks", Amenities included', () => {
    renderRateBlock([], 4, {
      markedCharacteristics: [
        Characteristic.friendlyStaff,
        Characteristic.freeWifi,
        Characteristic.outdoorSeating,
        Characteristic.petFriendly,
      ],
    });

    expect(markNames()).toEqual([
      'Remove Friendly Staff',
      'Remove Free Wi-Fi',
      'Remove Outdoor Seating',
      'Remove Pet Friendly',
    ]);
  });

  it('shows no "Your marks" when nothing is marked', () => {
    renderRateBlock([], 4);

    expect(marks()).not.toBeInTheDocument();
    expect(screen.queryByText('Your marks')).not.toBeInTheDocument();
  });

  it('un-marks a Characteristic removed from "Your marks"', async () => {
    const user = userEvent.setup();
    const toggle = vi.fn();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.friendlyStaff, onCall: toggle })], 4, {
      markedCharacteristics: [Characteristic.friendlyStaff, Characteristic.freeWifi],
    });
    expect(screen.getByText('Friendly staff count: 1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove Friendly Staff' }));

    expect(markNames()).toEqual(['Remove Free Wi-Fi']);
    await waitFor(() => {
      expect(trackedEvents('characteristic_removed')).toEqual([
        ['characteristic_removed', { place_id: placeId, actor: 'guest', characteristic: 'friendlyStaff' }],
      ]);
    });
    expect(toggle).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Friendly staff count: 0')).toBeInTheDocument();
    expect(markNames()).toEqual(['Remove Free Wi-Fi']);
    // Removing a mark is an answer too: the question doesn't come back.
    expect(askedQuestions()).not.toContain('Friendly staff?');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('offers a mark for removal only once its Yes is saved', async () => {
    const user = userEvent.setup();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.yummyEats, delay: IN_FLIGHT_MS })], 4);

    await user.click(answer('Yummy eats?', 'Yes'));

    expect(marks()).not.toBeInTheDocument();
    await waitFor(() => {
      expect(markNames()).toEqual(['Remove Yummy Eats']);
    });
  });

  it('moves focus back to the Rating when the last mark is removed', async () => {
    const user = userEvent.setup();
    renderRateBlock([toggleCharacteristicMock({ characteristic: Characteristic.freeWifi })], 4, {
      markedCharacteristics: [Characteristic.freeWifi],
    });

    await user.click(screen.getByRole('button', { name: 'Remove Free Wi-Fi' }));

    expect(marks()).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'change' })).toHaveFocus();
  });

  it('restores the chip and explains a failed removal', async () => {
    const user = userEvent.setup();
    renderRateBlock(
      [toggleCharacteristicMock({ characteristic: Characteristic.freeWifi, fails: true, delay: IN_FLIGHT_MS })],
      4,
      { markedCharacteristics: [Characteristic.freeWifi] },
    );

    await user.click(screen.getByRole('button', { name: 'Remove Free Wi-Fi' }));

    expect(marks()).not.toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent(/check your connection/i);
    expect(markNames()).toEqual(['Remove Free Wi-Fi']);
    expect(trackedEvents('characteristic_removed')).toEqual([]);
  });

  it('offers the Review text form once the questions run out', async () => {
    const user = userEvent.setup();
    const onAddReviewText = vi.fn();
    renderRateBlock([], 4, {
      markedCharacteristics: [Characteristic.deliciousFilterCoffee, Characteristic.yummyEats],
      onAddReviewText,
    });

    expect(reviewTextLink()).not.toBeInTheDocument();
    await skipAll(user);

    await user.click(reviewTextLink()!);

    expect(onAddReviewText).toHaveBeenCalledTimes(1);
    expect(trackedEvents('review_text_link_click')).toEqual([
      ['review_text_link_click', { place_id: placeId, actor: 'guest' }],
    ]);
  });

  it('does not offer the Review text form before a Rating', () => {
    renderRateBlock([], null, {
      markedCharacteristics: [
        Characteristic.deliciousFilterCoffee,
        Characteristic.pleasantAtmosphere,
        Characteristic.yummyEats,
        Characteristic.friendlyStaff,
        Characteristic.affordablePrices,
      ],
    });

    expect(reviewTextLink()).not.toBeInTheDocument();
  });

  it('does not offer the Review text form to a person who already wrote Review text', async () => {
    const user = userEvent.setup();
    renderRateBlock([], 4, { hasReviewText: true });

    await skipAll(user);
    await user.click(screen.getByRole('button', { name: 'More questions?' }));
    await skipAll(user);

    expect(askedQuestions()).toEqual([]);
    expect(reviewTextLink()).not.toBeInTheDocument();
  });

  it('opens no "Create account" modal after a Rating, a Yes or a removed mark', async () => {
    const user = userEvent.setup();
    const modalBefore = useModalStore.getState().modalContentVariant;
    renderRateBlock(
      [
        addRatingMock(),
        ...refetchMocks(),
        toggleCharacteristicMock({ characteristic: Characteristic.pleasantAtmosphere }),
        toggleCharacteristicMock({ characteristic: Characteristic.freeWifi }),
      ],
      null,
      { markedCharacteristics: [Characteristic.freeWifi] },
    );

    await user.click(screen.getByRole('button', { name: 'Remove Free Wi-Fi' }));
    await user.click(bean(4));
    await user.click(answer('Pleasant atmosphere?', 'Yes'));

    await waitFor(() => {
      expect(trackedEvents('characteristic_answered')).toHaveLength(1);
    });
    expect(trackedEvents('characteristic_removed')).toHaveLength(1);
    expect(trackedEvents('rating_saved')).toHaveLength(1);
    expect(useModalStore.getState().modalContentVariant).toBe(modalBefore);
  });
  it('takes a person with no Rating from the header button to the beans', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    // jsdom has no scrolling, so the stub stands in for it.
    Element.prototype.scrollIntoView = scrollIntoView;
    renderRateBlock([], null, { withRateButton: true });

    await user.click(screen.getByRole('button', { name: 'Rate place' }));

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(bean(1)).toHaveFocus();
    expect(trackedEvents('rate_place_click')).toEqual([
      ['rate_place_click', expect.objectContaining({ place_id: placeId, actor: 'guest' })],
    ]);
  });

  it('shows the Rating on the header button and opens the beans on it for a change', async () => {
    const user = userEvent.setup();
    Element.prototype.scrollIntoView = vi.fn();
    renderRateBlock([], 3, { withRateButton: true });

    await user.click(screen.getByRole('button', { name: 'Your rating: 3' }));

    expect(bean(3)).toBeChecked();
    expect(bean(3)).toHaveFocus();
    expect(trackedEvents('rate_place_click')).toHaveLength(1);
  });
  describe('Add a photo', () => {
    it('is not offered before a Rating', () => {
      renderRateBlock([]);

      expect(addPhotoButton()).not.toBeInTheDocument();
    });

    it('is disabled while the first Rating saves, then uploads to the Review the Rating created', async () => {
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock([
        addRatingMock({ delay: IN_FLIGHT_MS }),
        ...refetchMocks(),
        uploadMock({ onCall: uploaded }),
        uploadMock({ onCall: uploaded }),
      ]);

      await user.click(bean(4));

      expect(addPhotoButton()).toBeDisabled();
      await waitFor(() => {
        expect(addPhotoButton()).toBeEnabled();
      });

      await user.click(addPhotoButton()!);
      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);

      expect(await screen.findByText('2 photos added')).toBeInTheDocument();
      expect(uploaded).toHaveBeenCalledTimes(2);
      expect(screen.getAllByText('Saved')).toHaveLength(2);
      expect(ensureGuestIdentity).toHaveBeenCalled();
    });

    it('goes with a first Rating that fails to save', async () => {
      const user = userEvent.setup();
      renderRateBlock([
        {
          request: { query: AddRatingDocument, variables: { placeId, rating: 4, ...guest } },
          error: new Error('down'),
        },
      ]);

      await user.click(bean(4));

      await screen.findByRole('alert');
      expect(addPhotoButton()).not.toBeInTheDocument();
    });

    it('is offered to a returning person, while they change the Rating and with Review text', async () => {
      const user = userEvent.setup();
      renderRateBlock([], 3, { ownReviewId: 'own-review', hasReviewText: true });

      expect(addPhotoButton()).toBeEnabled();

      await user.click(screen.getByRole('button', { name: 'change' }));

      expect(addPhotoButton()).toBeEnabled();
    });

    it('uploads to the own Review for a returning person', async () => {
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock([uploadMock({ reviewId: 'own-review', onCall: uploaded })], 3, { ownReviewId: 'own-review' });

      await pickPhotos(user, [photo('a.jpg')]);

      expect(await screen.findByText('1 photo added')).toBeInTheDocument();
      expect(uploaded).toHaveBeenCalledTimes(1);
    });

    it('is not offered when the Review already has 10 Photos', () => {
      renderRateBlock([], 3, { ownReviewId: 'own-review', ownReviewPhotoCount: 10 });

      expect(addPhotoButton()).not.toBeInTheDocument();
    });

    it('opens a picker for several images, the library or the camera', () => {
      renderRateBlock([], 3, { ownReviewId: 'own-review' });

      const input = screen.getByLabelText('Choose photos');
      expect(input).toHaveAttribute('type', 'file');
      expect(input).toHaveAttribute('accept', 'image/*');
      expect(input).toHaveAttribute('multiple');
      expect(input).not.toHaveAttribute('capture');
    });

    it('drops the files the Review has no room for', async () => {
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock([uploadMock({ reviewId: 'own-review', onCall: uploaded })], 3, {
        ownReviewId: 'own-review',
        ownReviewPhotoCount: 9,
      });

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg'), photo('c.jpg')]);

      expect(await screen.findByText('You can add 1 more')).toBeInTheDocument();
      expect(await screen.findByText('1 photo added')).toBeInTheDocument();
      expect(uploaded).toHaveBeenCalledTimes(1);
      // The Review is full now.
      expect(screen.queryByRole('button', { name: 'Add more' })).not.toBeInTheDocument();
    });

    it('offers "Add more" once a batch settles, counting the Photos it saved only once', async () => {
      const user = userEvent.setup();
      const refetched = vi.fn();
      renderRateBlock(
        [
          placeReviewsMock({ ownPhotos: 7 }),
          uploadMock({ reviewId: 'own-review', delay: IN_FLIGHT_MS }),
          uploadMock({ reviewId: 'own-review' }),
          placeReviewsMock({ ownPhotos: 9, onCall: refetched }),
          uploadMock({ reviewId: 'own-review' }),
          placeReviewsMock({ ownPhotos: 10 }),
        ],
        3,
        { ownReviewId: 'own-review', ownReviewPhotoCount: 7, watchesReviews: true },
      );

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);

      expect(screen.queryByRole('button', { name: 'Add more' })).not.toBeInTheDocument();
      expect(await screen.findByText('2 photos added')).toBeInTheDocument();
      // The refetch now reports the 9 Photos, the 2 saved here included.
      await waitFor(() => {
        expect(refetched).toHaveBeenCalledTimes(1);
      });

      await user.click(await screen.findByRole('button', { name: 'Add more' }));
      await pickPhotos(user, [photo('c.jpg'), photo('d.jpg')]);

      // 7 before this page view, 2 saved in the first batch: room for one more.
      expect(await screen.findByText('You can add 1 more')).toBeInTheDocument();
      expect(await screen.findByText('3 photos added')).toBeInTheDocument();
    });

    it('counts Photos the Review gains elsewhere in the page view', async () => {
      const user = userEvent.setup();
      renderRateBlock(
        [
          placeReviewsMock({ ownPhotos: 7 }),
          uploadMock({ reviewId: 'own-review' }),
          placeReviewsMock({ ownPhotos: 8 }),
          // The Review text form added 2 more.
          placeReviewsMock({ ownPhotos: 10 }),
        ],
        3,
        { ownReviewId: 'own-review', watchesReviews: true },
      );

      await pickPhotos(user, [photo('a.jpg')]);
      await screen.findByRole('button', { name: 'Add more' });
      await user.click(screen.getByRole('button', { name: 'Refetch reviews' }));

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: 'Add more' })).not.toBeInTheDocument();
      });
      expect(screen.getByText('1 photo added')).toBeInTheDocument();
    });

    it.each([
      { code: 'RATE_LIMITED', reason: 'rate_limited', message: 'Too many photos for now, try again later' },
      { code: 'IMAGE_LIMIT_REACHED', reason: 'limit_reached', message: 'This review already has 10 photos' },
      // The server's "too large".
      { code: 'BAD_USER_INPUT', reason: 'unreadable', message: "This photo couldn't be read, try a JPEG or PNG" },
      {
        code: undefined,
        reason: 'network',
        message: "We couldn't save that. Please check your connection and try again.",
      },
    ])('shows why a Photo failed as $reason and reports it', async ({ code, reason, message }) => {
      const user = userEvent.setup();
      renderRateBlock([failedUploadMock({ code })], 3, { ownReviewId: 'own-review' });

      await pickPhotos(user, [photo('a.jpg')]);

      expect(await screen.findByRole('alert')).toHaveTextContent(message);
      expect(within(thumbnailOf('a.jpg')).getByText(message)).toBeInTheDocument();
      expect(trackedEvents('contribution_failed')).toEqual([
        ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'photo', reason }],
      ]);
      expect(trackedEvents('photos_uploaded')).toHaveLength(0);
    });

    it('keeps the picked Photos and fails them as reCAPTCHA when the Guest identity check fails', async () => {
      vi.mocked(ensureGuestIdentity).mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
      const user = userEvent.setup();
      renderRateBlock([], 3, { ownReviewId: 'own-review' });

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);

      expect(await screen.findByRole('alert')).toHaveTextContent(/ad blocker/i);
      expect(within(thumbnailOf('a.jpg')).getByText(/ad blocker/i)).toBeInTheDocument();
      expect(within(thumbnailOf('b.jpg')).getByText(/ad blocker/i)).toBeInTheDocument();
      expect(trackedEvents('photos_uploaded')).toHaveLength(0);
      expect(trackedEvents('contribution_failed')).toEqual([
        ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'photo', reason: 'recaptcha' }],
        ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'photo', reason: 'recaptcha' }],
      ]);
    });

    it('keeps the Photos that saved when another one fails', async () => {
      const user = userEvent.setup();
      renderRateBlock([failedUploadMock({ code: 'RATE_LIMITED' }), uploadMock({ reviewId: 'own-review' })], 3, {
        ownReviewId: 'own-review',
      });

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);

      expect(await screen.findByText('1 photo added')).toBeInTheDocument();
      expect(within(thumbnailOf('b.jpg')).getByText('Saved')).toBeInTheDocument();
      expect(within(thumbnailOf('a.jpg')).queryByText('Saved')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Too many photos for now, try again later');
      expect(trackedEvents('contribution_failed')).toHaveLength(1);
      await waitFor(() => {
        expect(trackedEvents('photos_uploaded')).toEqual([
          ['photos_uploaded', { place_id: placeId, actor: 'guest', count: 1, had_text: false }],
        ]);
      });
    });

    it('fails an unreadable file alone while the rest upload', async () => {
      vi.mocked(resizeAndConvert).mockRejectedValueOnce(new Error('Cannot decode'));
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock([uploadMock({ reviewId: 'own-review', onCall: uploaded })], 3, { ownReviewId: 'own-review' });

      await pickPhotos(user, [photo('a.heic'), photo('b.jpg')]);

      expect(await screen.findByText('1 photo added')).toBeInTheDocument();
      expect(uploaded).toHaveBeenCalledTimes(1);
      const unreadable = thumbnailOf('a.heic');
      expect(within(unreadable).getByText("This photo couldn't be read, try a JPEG or PNG")).toBeInTheDocument();
      // Sending it again would fail the same way.
      expect(within(unreadable).queryByRole('button', { name: /Retry/ })).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent("This photo couldn't be read, try a JPEG or PNG");
      expect(trackedEvents('contribution_failed')).toEqual([
        ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'photo', reason: 'unreadable' }],
      ]);
    });

    it('resends only the failed Photo on Retry and clears the alert once it saves', async () => {
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock(
        [
          failedUploadMock(),
          uploadMock({ reviewId: 'own-review', onCall: uploaded }),
          uploadMock({ reviewId: 'own-review', onCall: uploaded }),
        ],
        3,
        { ownReviewId: 'own-review' },
      );

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);
      await screen.findByText('1 photo added');
      expect(screen.getByRole('alert')).toBeInTheDocument();

      await user.click(within(thumbnailOf('a.jpg')).getByRole('button', { name: 'Retry a.jpg' }));

      expect(await screen.findByText('2 photos added')).toBeInTheDocument();
      expect(uploaded).toHaveBeenCalledTimes(2);
      expect(within(thumbnailOf('a.jpg')).getByText('Saved')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(trackedEvents('contribution_failed')).toHaveLength(1);
      await waitFor(() => {
        expect(trackedEvents('photos_uploaded')).toHaveLength(2);
      });
    });

    it('reports each failed attempt when a Retry fails again', async () => {
      const user = userEvent.setup();
      renderRateBlock([failedUploadMock(), failedUploadMock({ code: 'IMAGE_LIMIT_REACHED' })], 3, {
        ownReviewId: 'own-review',
      });

      await pickPhotos(user, [photo('a.jpg')]);
      await screen.findByRole('alert');
      await user.click(screen.getByRole('button', { name: 'Retry a.jpg' }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('This review already has 10 photos');
      });
      expect(trackedEvents('contribution_failed').map(([, params]) => params?.reason)).toEqual([
        'network',
        'limit_reached',
      ]);
    });

    it('checks the Guest identity again on Retry', async () => {
      vi.mocked(ensureGuestIdentity)
        .mockRejectedValueOnce(new RecaptchaUnavailableError('reCAPTCHA failed to load'))
        .mockResolvedValue(guest);
      const user = userEvent.setup();
      const uploaded = vi.fn();
      renderRateBlock([uploadMock({ reviewId: 'own-review', onCall: uploaded })], 3, { ownReviewId: 'own-review' });

      await pickPhotos(user, [photo('a.jpg')]);
      await user.click(await screen.findByRole('button', { name: 'Retry a.jpg' }));

      expect(await screen.findByText('1 photo added')).toBeInTheDocument();
      expect(ensureGuestIdentity).toHaveBeenCalledTimes(2);
      expect(uploaded).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('cancels the upload when the block goes away, without an error', async () => {
      const user = userEvent.setup();
      const uploaded = vi.fn();
      const { unmount } = renderRateBlock(
        [
          uploadMock({ reviewId: 'own-review', delay: IN_FLIGHT_MS }),
          uploadMock({ reviewId: 'own-review', onCall: uploaded }),
        ],
        3,
        { ownReviewId: 'own-review' },
      );

      await pickPhotos(user, [photo('a.jpg'), photo('b.jpg')]);
      await screen.findByRole('progressbar', { name: 'Upload progress for a.jpg' });
      unmount();
      await new Promise((resolve) => setTimeout(resolve, IN_FLIGHT_MS * 2));

      expect(uploaded).not.toHaveBeenCalled();
      expect(trackedEvents('contribution_failed')).toHaveLength(0);
      expect(console.error).not.toHaveBeenCalled();
    });

    it('refetches the Place reviews once a batch saves, with no "Create account" modal', async () => {
      const user = userEvent.setup();
      const refetched = vi.fn();
      const modalBefore = useModalStore.getState().modalContentVariant;
      renderRateBlock(
        [
          placeReviewsMock(),
          uploadMock({ reviewId: 'own-review' }),
          placeReviewsMock({ ownPhotos: 1, onCall: refetched }),
        ],
        3,
        {
          ownReviewId: 'own-review',
          watchesReviews: true,
        },
      );

      await pickPhotos(user, [photo('a.jpg')]);

      await waitFor(() => {
        expect(refetched).toHaveBeenCalledTimes(1);
      });
      expect(useModalStore.getState().modalContentVariant).toBe(modalBefore);
    });

    it('reports the taps and the saved batch', async () => {
      const user = userEvent.setup();
      renderRateBlock([uploadMock({ reviewId: 'own-review' }), uploadMock({ reviewId: 'own-review' })], 3, {
        ownReviewId: 'own-review',
        hasReviewText: true,
      });

      await user.click(addPhotoButton()!);
      await pickPhotos(user, [photo('a.jpg')]);
      await user.click(await screen.findByRole('button', { name: 'Add more' }));
      await pickPhotos(user, [photo('b.jpg')]);
      await screen.findByText('2 photos added');

      expect(trackedEvents('photo_button_click')).toEqual([
        ['photo_button_click', { place_id: placeId, actor: 'guest' }],
        ['photo_button_click', { place_id: placeId, actor: 'guest' }],
      ]);
      await waitFor(() => {
        expect(trackedEvents('photos_uploaded')).toHaveLength(2);
      });
      expect(trackedEvents('photos_uploaded')[0]).toEqual([
        'photos_uploaded',
        { place_id: placeId, actor: 'guest', count: 1, had_text: true },
      ]);
    });
  });
});
