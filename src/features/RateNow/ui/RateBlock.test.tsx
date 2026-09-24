import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AddRatingDocument, PlaceDocument, PlaceReviewsDocument } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { setUser } from 'shared/stores/auth';
import { RateBlock } from './RateBlock';

vi.mock('shared/lib/guest', () => ({ ensureGuestIdentity: vi.fn() }));
vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('shared/stores/places', () => ({ revalidatePlaces: vi.fn() }));

const placeId = 'place-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

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
  { request: { query: PlaceDocument, variables: { placeId } }, result: { data: { place: null } } },
  {
    request: { query: PlaceReviewsDocument, variables: { placeId } },
    result: { data: { placeReviews: { __typename: 'PlaceReviews', id: placeId, reviews: [] } } },
  },
];

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

const renderRateBlock = (mocks: MockedResponse[], rating?: number | null) =>
  render(
    <MockedProvider mocks={mocks}>
      <RateBlock placeId={placeId} rating={rating} />
    </MockedProvider>,
  );

const bean = (rating: number) => screen.getByRole('radio', { name: `${rating} of 5` });

const trackedEvents = (name: string) => vi.mocked(trackEvent).mock.calls.filter(([eventName]) => eventName === name);

describe('RateBlock', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
    setUser(null);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.mocked(trackEvent).mockClear();
    vi.mocked(ensureGuestIdentity).mockReset();
  });

  it('asks a person with no Rating to rate the Place', () => {
    renderRateBlock([]);

    expect(screen.getByRole('heading', { name: 'Been here? Rate it' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('thanks the Guest and shows the Rating the moment a bean is tapped', async () => {
    const user = userEvent.setup();
    const addRating = vi.fn();
    renderRateBlock([addRatingMock({ onCall: addRating, delay: 50 }), ...refetchMocks()]);

    await user.click(bean(4));

    const thanks = screen.getByRole('status');
    expect(thanks).toHaveTextContent('Thanks!');
    expect(thanks).toHaveTextContent('Your rating: 4');
    // The tapped bean is gone, so focus moves to what replaced it.
    expect(screen.getByRole('button', { name: 'change' })).toHaveFocus();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(addRating).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(addRating).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Your rating: 4');
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

    const summary = screen.getByRole('status');
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

    expect(screen.getByRole('status')).toHaveTextContent('Your rating: 5');
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
});
