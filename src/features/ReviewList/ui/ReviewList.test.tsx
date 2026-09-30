import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { type Review } from 'shared/generated/graphql';
import { clearGuestIdentity, writeGuestIdentity } from 'shared/lib/guest';
import { setUser } from 'shared/stores/auth';
import { ReviewList } from './ReviewList';

const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

const review = (overrides: Partial<Review>): Review => ({
  __typename: 'Review',
  id: 'review-1',
  placeId: 'place-1',
  text: 'Great coffee',
  userAvatar: null,
  userId: null,
  userName: 'A Guest',
  createdAt: new Date().toISOString(),
  userRating: 4,
  characteristics: null,
  isOwnReview: false,
  reviewImages: 0,
  isGoogleReview: false,
  ...overrides,
});

const renderReviewList = (reviews: Review[]) =>
  render(
    <MockedProvider>
      <ReviewList reviews={reviews} placeId="place-1" isCompactView={false} setCompactView={() => {}} />
    </MockedProvider>,
  );

describe('ReviewList', () => {
  beforeEach(() => {
    setUser(null);
    clearGuestIdentity();
  });

  afterEach(() => {
    setUser(null);
    clearGuestIdentity();
  });

  it("shows the delete control on a Guest's own Review, not on someone else's", () => {
    writeGuestIdentity(guest);
    renderReviewList([
      review({ id: 'own', isOwnReview: true }),
      review({ id: 'other', isOwnReview: false, userName: 'Someone else' }),
    ]);

    expect(screen.getAllByTitle('Delete my review')).toHaveLength(1);
  });

  it('shows the delete control on a signed-in User’s own Review', () => {
    setUser({ id: 'user-1', displayName: 'Ada', email: 'ada@example.com', isGoogleUserUserWithoutPassword: false });
    renderReviewList([review({ id: 'own', isOwnReview: true })]);

    expect(screen.getByTitle('Delete my review')).toBeInTheDocument();
  });

  it('hides the delete control on an own Review when there is no User and no Guest identity', () => {
    renderReviewList([review({ id: 'own', isOwnReview: true })]);

    expect(screen.queryByTitle('Delete my review')).not.toBeInTheDocument();
    // Edit stays available: only deleting needs proof of identity.
    expect(screen.getByTitle('Edit my feedback')).toBeInTheDocument();
  });
});
