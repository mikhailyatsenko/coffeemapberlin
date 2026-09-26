import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AddRatingDocument,
  type AddRatingMutationVariables,
  PlaceDocument,
  PlaceReviewsDocument,
} from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { setUser } from 'shared/stores/auth';
import { OneTapRating, type OneTapRatingProps } from './OneTapRating';

vi.mock('shared/lib/guest', () => {
  const ensureGuestIdentity = vi.fn();
  return {
    ensureGuestIdentity,
    contributionCredentials: (isSignedIn: boolean) => (isSignedIn ? Promise.resolve({}) : ensureGuestIdentity()),
  };
});
vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('shared/stores/places', () => ({ revalidatePlaces: vi.fn() }));

const placeId = 'place-1';
const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

const addRatingMock = ({
  variables = { placeId, rating: 4, ...guest },
  onCall = () => {},
  delay = 0,
}: {
  variables?: AddRatingMutationVariables;
  onCall?: () => void;
  delay?: number;
} = {}): MockedResponse => ({
  request: { query: AddRatingDocument, variables },
  delay,
  result: () => {
    onCall();
    return {
      data: {
        addRating: {
          __typename: 'AddRatingResult',
          averageRating: variables.rating,
          ratingCount: 1,
          reviewId: 'review-1',
          userRating: variables.rating,
        },
      },
    };
  },
});

const failingAddRatingMock = (rating = 4): MockedResponse => ({
  request: { query: AddRatingDocument, variables: { placeId, rating, ...guest } },
  error: new Error('Network down'),
});

// The background refetch after a save; the Place page's queries are never in the cache here.
const refetchMocks = (): MockedResponse[] => [
  { request: { query: PlaceDocument, variables: { placeId } }, result: { data: { place: null } } },
  {
    request: { query: PlaceReviewsDocument, variables: { placeId } },
    result: { data: { placeReviews: { __typename: 'PlaceReviews', id: placeId, reviews: [] } } },
  },
];

const renderOneTapRating = (mocks: MockedResponse[], props: Partial<OneTapRatingProps> = {}) =>
  render(
    <MockedProvider mocks={mocks}>
      <OneTapRating placeId={placeId} {...props} />
    </MockedProvider>,
  );

const bean = (rating: number) => screen.getByRole('radio', { name: `${rating} of 5` });

const trackedEvents = (name: string) => vi.mocked(trackEvent).mock.calls.filter(([eventName]) => eventName === name);

describe('OneTapRating with no Place page queries in the cache', () => {
  let unhandled: unknown[];
  const onUnhandled = (reason: unknown) => {
    unhandled.push(reason);
  };

  beforeEach(() => {
    unhandled = [];
    process.on('unhandledRejection', onUnhandled);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
    setUser(null);
  });

  afterEach(() => {
    process.off('unhandledRejection', onUnhandled);
    vi.restoreAllMocks();
    vi.mocked(trackEvent).mockClear();
    vi.mocked(ensureGuestIdentity).mockReset();
  });

  it('saves a Guest Rating on one tap and shows it before the server answers', async () => {
    const user = userEvent.setup();
    const addRating = vi.fn();
    const onSaved = vi.fn();
    renderOneTapRating([addRatingMock({ onCall: addRating, delay: 50 }), ...refetchMocks()], { onSaved });

    await user.click(bean(4));

    expect(bean(4)).toBeChecked();
    expect(addRating).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledWith(4, 'review-1');
    });
    expect(addRating).toHaveBeenCalledTimes(1);
    expect(bean(4)).toBeChecked();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(unhandled).toEqual([]);
  });

  it('sends rating_saved once per confirmed save', async () => {
    const user = userEvent.setup();
    renderOneTapRating([addRatingMock(), ...refetchMocks()]);

    await user.click(bean(4));

    await waitFor(() => {
      expect(trackedEvents('rating_saved')).toEqual([
        ['rating_saved', { place_id: placeId, actor: 'guest', rating: 4, is_change: false }],
      ]);
    });
    expect(trackedEvents('contribution_failed')).toEqual([]);
  });

  it('marks a save as a change when the person already had a Rating', async () => {
    const user = userEvent.setup();
    renderOneTapRating([addRatingMock(), ...refetchMocks()], { rating: 2 });

    expect(bean(2)).toBeChecked();
    await user.click(bean(4));

    await waitFor(() => {
      expect(trackedEvents('rating_saved')).toEqual([
        ['rating_saved', { place_id: placeId, actor: 'guest', rating: 4, is_change: true }],
      ]);
    });
  });

  it('follows the current Rating its caller passes after a save', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    const mocks = [addRatingMock(), ...refetchMocks()];
    const { rerender } = renderOneTapRating(mocks, { onSaved });

    await user.click(bean(4));
    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledWith(4, 'review-1');
    });
    // The Rating was deleted elsewhere, e.g. from the person's Review card.
    rerender(
      <MockedProvider mocks={mocks}>
        <OneTapRating placeId={placeId} rating={null} onSaved={onSaved} />
      </MockedProvider>,
    );

    expect(bean(4)).not.toBeChecked();
  });

  it('saves a User Rating without Guest credentials', async () => {
    setUser({
      id: 'user-1',
      displayName: 'Ada',
      email: 'ada@example.com',
      isGoogleUserUserWithoutPassword: false,
    });
    const user = userEvent.setup();
    const onSaved = vi.fn();
    renderOneTapRating([addRatingMock({ variables: { placeId, rating: 4 } }), ...refetchMocks()], { onSaved });

    await user.click(bean(4));

    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledWith(4, 'review-1');
    });
    expect(ensureGuestIdentity).not.toHaveBeenCalled();
    expect(trackedEvents('rating_saved')).toEqual([
      ['rating_saved', { place_id: placeId, actor: 'user', rating: 4, is_change: false }],
    ]);
  });

  it('rolls back to the previous Rating and explains a network failure', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    renderOneTapRating([failingAddRatingMock()], { rating: 2, onSaved });

    await user.click(bean(4));

    expect(await screen.findByRole('alert')).toHaveTextContent(/check your connection/i);
    expect(bean(2)).toBeChecked();
    expect(bean(4)).not.toBeChecked();
    expect(onSaved).not.toHaveBeenCalled();
    expect(trackedEvents('contribution_failed')).toEqual([
      ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'rating', reason: 'network' }],
    ]);
    expect(trackedEvents('rating_saved')).toEqual([]);
    expect(unhandled).toEqual([]);
  });

  it('rolls back to no Rating and explains a blocked reCAPTCHA', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValue(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const user = userEvent.setup();
    const addRating = vi.fn();
    renderOneTapRating([addRatingMock({ onCall: addRating })]);

    await user.click(bean(4));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ad blocker/i);
    expect(alert).toHaveTextContent(/sign in/i);
    expect(screen.getAllByRole('radio').filter((radio) => radio.getAttribute('aria-checked') === 'true')).toEqual([]);
    expect(addRating).not.toHaveBeenCalled();
    expect(trackedEvents('contribution_failed')).toEqual([
      ['contribution_failed', { place_id: placeId, actor: 'guest', kind: 'rating', reason: 'recaptcha' }],
    ]);
    expect(unhandled).toEqual([]);
  });

  it('clears the message on the next successful save', async () => {
    vi.mocked(ensureGuestIdentity).mockRejectedValueOnce(new RecaptchaUnavailableError('reCAPTCHA failed to load'));
    const user = userEvent.setup();
    renderOneTapRating([addRatingMock(), ...refetchMocks()]);

    await user.click(bean(4));
    await screen.findByRole('alert');
    await user.click(bean(4));

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
    expect(bean(4)).toBeChecked();
  });

  it('sends one mutation however many beans are tapped during a save', async () => {
    let resolveIdentity: (value: typeof guest) => void = () => {};
    vi.mocked(ensureGuestIdentity).mockReturnValue(
      new Promise((resolve) => {
        resolveIdentity = resolve;
      }),
    );
    const user = userEvent.setup();
    const addRating = vi.fn();
    const onSaved = vi.fn();
    renderOneTapRating(
      [addRatingMock({ onCall: addRating }), addRatingMock({ onCall: addRating }), ...refetchMocks()],
      {
        onSaved,
      },
    );

    await user.click(bean(4));
    await user.click(bean(2));
    resolveIdentity(guest);

    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledTimes(1);
    });
    expect(addRating).toHaveBeenCalledTimes(1);
    expect(ensureGuestIdentity).toHaveBeenCalledTimes(1);
    expect(bean(4)).toBeChecked();
  });

  it('is reached with Tab and saves with Enter', async () => {
    const user = userEvent.setup();
    const onSaved = vi.fn();
    renderOneTapRating([addRatingMock(), ...refetchMocks()], { onSaved });

    await user.tab();
    await user.keyboard('{End}{ArrowLeft}{Enter}');

    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledWith(4, 'review-1');
    });
  });
});
